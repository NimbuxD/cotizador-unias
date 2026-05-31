import { Quotation } from './quotation.entity';
import { NailService } from '../services/nail-service.entity';
export declare class QuotationService {
    id: number;
    quotationId: number;
    serviceId: number;
    quantity: number;
    materialCost: number;
    quotation: Quotation;
    service: NailService;
}
