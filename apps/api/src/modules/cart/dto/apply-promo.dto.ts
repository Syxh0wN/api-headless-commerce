import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyPromoDto {
  @ApiProperty({ example: 'DESCONTO10' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
