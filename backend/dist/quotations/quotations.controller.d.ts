import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    create(dto: CreateQuotationDto): Promise<import("./quotation.entity").Quotation>;
    findAll(): Promise<import("./quotation.entity").Quotation[]>;
    getStats(): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        cancelled: number;
        todayCount: number;
        monthlyRevenue: number;
        monthlyMaterialCost: number;
        averageQuotationValue: number;
    }>;
    findOne(id: number): Promise<import("./quotation.entity").Quotation>;
    update(id: number, dto: UpdateQuotationDto): Promise<import("./quotation.entity").Quotation>;
    remove(id: number): Promise<void>;
}
