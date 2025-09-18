import { IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Produto Exemplo' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Descrição do produto' })
  @IsString()
  description: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'categoria-exemplo' })
  @IsString()
  category: string;

  @ApiProperty({ example: ['tag1', 'tag2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 'https://exemplo.com/imagem.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  isActive?: boolean;
}
