export type QuotationStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface QuotationService {
  id?: number;
  serviceId: number;
  serviceName?: string;
  quantity: number;
  unitPrice: number;
  materialCost?: number;
  laborCost?: number;
  subtotal?: number;
}

export interface Quotation {
  id: number;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  status: QuotationStatus;
  notes?: string;
  services?: QuotationService[];
  totalMaterialCost?: number;
  totalLaborCost?: number;
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuotationDto {
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  status?: QuotationStatus;
  notes?: string;
  services?: QuotationService[];
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  todayQuotations: number;
  totalServices: number;
  pendingQuotations: number;
}
