import { Repository } from 'typeorm';
import { Quotation } from './quotation.entity';
import { QuotationService as QuotationServiceEntity } from './quotation-service.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { ServicesService } from '../services/services.service';
export declare class QuotationsService {
    private readonly quotationRepository;
    private readonly quotationServiceRepository;
    private readonly servicesService;
    constructor(quotationRepository: Repository<Quotation>, quotationServiceRepository: Repository<QuotationServiceEntity>, servicesService: ServicesService);
    create(dto: CreateQuotationDto): Promise<Quotation>;
    findAll(): Promise<Quotation[]>;
    findOne(id: number): Promise<Quotation>;
    update(id: number, dto: UpdateQuotationDto): Promise<Quotation>;
    remove(id: number): Promise<void>;
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
}
