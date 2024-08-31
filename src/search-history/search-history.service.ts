import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { UpdateSearchHistoryDto } from './dto/update-search-history.dto';
import { parts } from '../utils/brands';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { SearchHistory } from './entities/search-history.entity';
import { CreateSearchHistoryDto } from './dto/create-search-history.dto';
import { UsersService } from '../users/users.service';
import { GoogleGenerativeAIService } from '../utils/google-generative-ai/google-generative-ai.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { searchHistoryPaginationConfig } from './config/search-history-pagination.config';
import { NullableType } from '../utils/types/nullable.type';
import { AwsS3Service } from '../utils/aws-s3/aws-s3.service';
import { SearchByUrlDto } from './dto/search-by-url.dto';
import * as mime from 'mime-types';
import axios from 'axios';
import { SearchProductDto } from './dto/search-product.dto';
import { ConfigService } from '@nestjs/config';
import { SearchResultResponse } from './response/search-result.response';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { OpenAiService } from '../utils/open-ai/open-ai.service';
import { isJSON } from 'class-validator';

@Injectable()
export class SearchHistoryService {
  constructor(
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepository: Repository<SearchHistory>,
    private readonly userService: UsersService,
    private readonly googleGenerativeAIService: GoogleGenerativeAIService,
    private readonly openAiService: OpenAiService,
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    file: Express.Multer.File | Express.MulterS3.File,
  ) {
    const result = await this.googleGenerativeAIService.generateContent(
      parts,
      file,
    );
    const { brand, model, reference_number, color } = this.extractDetails(
      result.response.text(),
    );
    const searchResult = new CreateSearchHistoryDto({
      brand: brand,
      model: model,
      color: color,
      referenceNumber: reference_number,
      imageUrl: (file as Express.MulterS3.File).location,
    });
    const searchHistory = this.searchHistoryRepository.create(
      searchResult as DeepPartial<SearchHistory>,
    );
    searchHistory.user = await this.userService.findOneOrFail({
      id: userJwtPayload.id,
    });
    // Process the response text to extract brand, model, and reference number
    return await this.searchHistoryRepository.save(searchHistory);
  }

  async searchList(searchProductDto: SearchProductDto): Promise<any> {
    const url = this.configService.getOrThrow('oxylabs.url', {
      infer: true,
    });
    const { results } = await axios
      .post(url, searchProductDto, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${this.configService.getOrThrow('oxylabs.username', {
                infer: true,
              })}:${this.configService.getOrThrow('oxylabs.password', {
                infer: true,
              })}`,
            ).toString('base64'),
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new PreconditionFailedException(error);
      });
    return results;
  }

  async createWithImageUrl(
    userJwtPayload: JwtPayloadType,
    searchByUrlDto: SearchByUrlDto,
  ): Promise<SearchResultResponse | null> {
    const base64Image = await this.awsS3Service.getFileFromBucketByUrl(
      searchByUrlDto.imageUrl,
    );
    const mimeType = mime.lookup(searchByUrlDto.imageUrl) as string;
    const result =
      await this.googleGenerativeAIService.generateContentFromBase64Image(
        parts,
        base64Image,
        mimeType,
      );
    const { brand, model, reference_number, color, description } =
      this.extractDetails(result.response.text());
    if (!brand) {
      return null;
    }
    const searchData = new SearchProductDto(
      'amazon_search',
      'fr',
      `${brand} ${model} ${color} ${reference_number}`,
      1,
      1,
      true,
    );
    const searchHistoryObject = new CreateSearchHistoryDto({
      brand: brand,
      model: model,
      color: color,
      referenceNumber: reference_number,
      imageUrl: searchByUrlDto.imageUrl,
    });
    const searchResult = await this.searchList(searchData);
    await this.saveSearch(searchHistoryObject, userJwtPayload);
    return {
      brand,
      model,
      color,
      referenceNumber: reference_number,
      description,
      result: searchResult[0].content.results.organic,
    };
  }

  async createWithImageOpenAiUrl(
    userJwtPayload: JwtPayloadType,
    searchByUrlDto: SearchByUrlDto,
  ) {
    const openAiResult =
      await this.openAiService.generateContent(searchByUrlDto);
    const { brand, model, color, reference_number, description } =
      this.extractDetails(openAiResult);
    if (!brand) {
      return null;
    }
    const searchData = new SearchProductDto(
      'amazon_search',
      'fr',
      `${brand} ${model} ${color}`,
      1,
      1,
      true,
    );
    const searchHistoryObject = new CreateSearchHistoryDto({
      brand: brand,
      model: model,
      color: color,
      referenceNumber: reference_number,
      imageUrl: searchByUrlDto.imageUrl,
    });
    const searchResult = await this.searchList(searchData);
    await this.saveSearch(searchHistoryObject, userJwtPayload);
    return {
      brand,
      model,
      color,
      referenceNumber: reference_number,
      description,
      result: searchResult[0].content.results.organic,
    };
  }

  async findAllPaginated(
    query: PaginateQuery,
  ): Promise<Paginated<SearchHistory>> {
    return await paginate(
      query,
      this.searchHistoryRepository,
      searchHistoryPaginationConfig,
    );
  }

  async findAllMePaginated(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ): Promise<Paginated<SearchHistory>> {
    const queryBuilder = this.searchHistoryRepository
      .createQueryBuilder('search')
      .leftJoinAndSelect('search.user', 'user')
      .where('user.id = :id', { id: userJwtPayload.id });
    return await paginate(query, queryBuilder, searchHistoryPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<SearchHistory>,
    relations?: FindOptionsRelations<SearchHistory>,
  ): Promise<NullableType<SearchHistory>> {
    return await this.searchHistoryRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<SearchHistory>,
    relations?: FindOptionsRelations<SearchHistory>,
  ): Promise<SearchHistory> {
    return await this.searchHistoryRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: number,
    updateSearchHistoryDto: UpdateSearchHistoryDto,
  ): Promise<SearchHistory> {
    const searchHistory = await this.findOneOrFail({ id });
    Object.assign(searchHistory, updateSearchHistoryDto);
    return await this.searchHistoryRepository.save(searchHistory);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.searchHistoryRepository.delete(id);
  }

  async saveSearch(
    searchHistoryObject: CreateSearchHistoryDto,
    userJwtPayload: JwtPayloadType,
  ): Promise<SearchHistory> {
    const searchHistory = this.searchHistoryRepository.create(
      searchHistoryObject as DeepPartial<SearchHistory>,
    );
    searchHistory.user = await this.userService.findOneOrFail({
      id: userJwtPayload.id,
    });
    // Process the response text to extract brand, model, and reference number
    return await this.searchHistoryRepository.save(searchHistory);
  }

  private extractDetails(responseText: string): {
    brand: string | null;
    model: string | null;
    color: string | null;
    reference_number: string | null;
    description: string | null;
  } {
    // Remove backticks and `json` label if present
    const cleanedResponseText = responseText.replace(/```json|```/g, '').trim();
    if (isJSON(cleanedResponseText)) {
      return JSON.parse(cleanedResponseText);
    }
    const brandRegex = /brand\s*:\s*["'`]?([^,"'`]+)["'`]?,?/i;
    const modelRegex = /model\s*:\s*["'`]?([^,"'`]+)["'`]?,?/i;
    const colorRegex = /color\s*:\s*["'`]?([^,"'`]+)["'`]?,?/i;
    const referenceNumberRegex =
      /reference_number\s*:\s*["'`]?([^,"'`}]+)["'`]?,?/i;
    const descriptionRegex = /description\s*:\s*["'`]?([^,"'`}]+)["'`]?,?/i;
    // Extract matches
    const brandMatch = responseText.match(brandRegex);
    const modelMatch = responseText.match(modelRegex);
    const colorMatch = responseText.match(colorRegex);
    const referenceNumberMatch = responseText.match(referenceNumberRegex);
    const descriptionMatch = responseText.match(descriptionRegex);
    // Extracted values
    const brand = brandMatch
      ? brandMatch[1] === 'null' || brandMatch[1].trim() === ''
        ? null
        : brandMatch[1].trim()
      : null;
    const model = modelMatch
      ? modelMatch[1] === 'null' || modelMatch[1].trim() === ''
        ? null
        : modelMatch[1].trim()
      : null;
    const color = colorMatch
      ? colorMatch[1] === 'null' || colorMatch[1].trim() === ''
        ? null
        : colorMatch[1].trim()
      : null;
    const reference_number = referenceNumberMatch
      ? referenceNumberMatch[1] === 'null' ||
        referenceNumberMatch[1].trim() === ''
        ? null
        : referenceNumberMatch[1].trim()
      : null;

    const description = descriptionMatch
      ? descriptionMatch[1] === 'null' || descriptionMatch[1].trim() === ''
        ? null
        : descriptionMatch[1].trim()
      : null;

    return { brand, model, color, reference_number, description };
  }
}
