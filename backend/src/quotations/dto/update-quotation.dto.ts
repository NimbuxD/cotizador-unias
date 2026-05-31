import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuotationStatus } from '../quotation.entity';
import { QuotationServiceItemDto } from './create-quotation.dto';

export class UpdateQuotationDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  clientName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  clientPhone?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuotationServiceItemDto)
  services?: QuotationServiceItemDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  finalPrice?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(QuotationStatus)
  @IsOptional()
  status?: QuotationStatus;
}
