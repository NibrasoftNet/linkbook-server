import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicantToSwapService } from './applicant-to-swap.service';
import { CreateApplicantToSwapDto } from './dto/create-applicant-to-swap.dto';
import { UpdateApplicantToSwapDto } from './dto/update-applicant-to-swap.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Applicant-to-swap')
@Controller({ version: '1', path: 'applicant-to-swap' })
export class ApplicantToSwapController {
  constructor(
    private readonly applicantToSwapService: ApplicantToSwapService,
  ) {}

  @Post()
  create(@Body() createApplicantToSwapDto: CreateApplicantToSwapDto) {
    return this.applicantToSwapService.create(createApplicantToSwapDto);
  }

  @Get()
  findAll() {
    return this.applicantToSwapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantToSwapService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicantToSwapDto: UpdateApplicantToSwapDto,
  ) {
    return this.applicantToSwapService.update(+id, updateApplicantToSwapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicantToSwapService.remove(+id);
  }
}
