import { IsString, IsArray, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { WebhookEventType } from './webhook-event.dto';

export class CreateWebhookDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsArray()
  @IsOptional()
  events?: WebhookEventType[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  secret?: string;
}
