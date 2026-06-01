export type QuotationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface QuotationService {
  id?: number;
  serviceId: number;
  serviceName?: string;
  quantity: number;
  unitPrice?: number;
  materialCost?: number;
  subtotal?: number;
  service?: { id: number; name: string; basePrice?: number };
}

export interface Quotation {
  id: number;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  status: QuotationStatus;
  notes?: string;
  date?: string;
  services?: QuotationService[];
  totalMaterialCost?: number;
  suggestedPrice?: number;
  finalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  appointmentTime?: string; // "HH:MM"
  arrivedAt?: string; // ISO timestamp
  extras?: { name: string; cost: number }[];
  extrasCost?: number;
  photos?: string[]; // base64 strings
}

export interface CreateQuotationDto {
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  date: string;
  status?: QuotationStatus;
  notes?: string;
  appointmentTime?: string;
  services?: QuotationService[];
  extras?: { name: string; cost: number }[];
  extrasCost?: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  todayQuotations: number;
  totalServices: number;
  pendingQuotations: number;
}
