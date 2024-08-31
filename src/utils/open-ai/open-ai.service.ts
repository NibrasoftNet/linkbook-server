import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchByUrlDto } from '../../search-history/dto/search-by-url.dto';
import OpenAI from 'openai';
import { parts } from '../brands';
import { Chat } from 'openai/resources';
import ChatCompletionContentPart = Chat.ChatCompletionContentPart;

@Injectable()
export class OpenAiService {
  constructor(
    @Inject('OpenAI') private readonly model: OpenAI,
    private readonly configService: ConfigService,
  ) {}

  async generateContent(searchByUrlDto: SearchByUrlDto): Promise<any> {
    const updatedContents = parts.map((item) => ({
      type: 'text',
      ...item,
    })) as ChatCompletionContentPart[];
    const response = await this.model.chat.completions.create({
      model: this.configService.getOrThrow<string>('openAI.openAiModelName', {
        infer: true,
      }),
      messages: [
        {
          role: 'user',
          content: [
            ...updatedContents,
            {
              type: 'image_url',
              image_url: {
                url: searchByUrlDto.imageUrl,
              },
            },
          ],
        },
      ],
    });
    return response.choices[0].message.content;
  }
}
