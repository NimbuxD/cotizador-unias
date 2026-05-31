import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuotationServiceItemDto {
  @IsNumber()
  serviceId: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;
}

export class CreateQuotationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  clientName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  clientPhone?: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuotationServiceItemDto)
  services: QuotationServiceItemDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  finalPrice?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
