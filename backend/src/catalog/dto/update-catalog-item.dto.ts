import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UpdateCatalogItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsNumber()
  quotationId?: number;

  @IsOptional()
  @IsString()
  serviceName?: string;
}
