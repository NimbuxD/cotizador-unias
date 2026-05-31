import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { ProductCategory, ProductUnit } from '../product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @IsEnum(ProductUnit)
  @IsOptional()
  unit?: ProductUnit;

  @IsNumber()
  @Min(0)
  unitCost: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentStock?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minStock?: number;
}
