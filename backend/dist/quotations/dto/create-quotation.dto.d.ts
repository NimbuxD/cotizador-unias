export declare class QuotationServiceItemDto {
    serviceId: number;
    quantity?: number;
}
export declare class CreateQuotationDto {
    clientName: string;
    clientPhone?: string;
    date: string;
    services: QuotationServiceItemDto[];
    finalPrice?: number;
    notes?: string;
}
