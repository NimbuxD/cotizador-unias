import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsDateString,
  IsEnum,
  Min,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuotationStatus, ExtraItem } from '../quotation.entity';

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

  @IsString()
  @IsOptional()
  @MaxLength(200)
  clientEmail?: string;

  @IsDateString()
  date: string;

  @IsEnum(QuotationStatus)
  @IsOptional()
  status?: QuotationStatus;

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

  @IsString()
  @IsOptional()
  appointmentTime?: string;

  @IsArray()
  @IsOptional()
  extras?: ExtraItem[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  extrasCost?: number;
}
