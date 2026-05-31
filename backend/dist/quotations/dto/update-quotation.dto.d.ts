import { QuotationStatus } from '../quotation.entity';
import { QuotationServiceItemDto } from './create-quotation.dto';
export declare class UpdateQuotationDto {
    clientName?: string;
    clientPhone?: string;
    date?: string;
    services?: QuotationServiceItemDto[];
    finalPrice?: number;
    notes?: string;
    status?: QuotationStatus;
}
