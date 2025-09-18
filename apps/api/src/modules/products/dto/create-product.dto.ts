import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Produto Exemplo' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'produto-exemplo' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'SKU123' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Descrição do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 9999 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'categoria-id' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: ['tag1', 'tag2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: true })
  @IsOptional()
  isActive?: boolean;
}
