import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductQueryDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ example: 'produto', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: 'categoria-exemplo', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'price', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ example: 'desc', required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
