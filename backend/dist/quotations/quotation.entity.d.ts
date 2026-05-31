import { QuotationService } from './quotation-service.entity';
export declare enum QuotationStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled"
}
export declare class Quotation {
    id: number;
    clientName: string;
    clientPhone: string;
    date: string;
    totalMaterialCost: number;
    suggestedPrice: number;
    finalPrice: number;
    notes: string;
    status: QuotationStatus;
    createdAt: Date;
    updatedAt: Date;
    services: QuotationService[];
}
