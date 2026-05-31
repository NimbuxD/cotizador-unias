export interface ServiceMaterial {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
}

export interface NailService {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  laborCost: number;
  materialCost?: number;
  totalCost?: number;
  materials?: ServiceMaterial[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNailServiceDto {
  name: string;
  description?: string;
  basePrice: number;
  laborCost: number;
  materials?: ServiceMaterial[];
}
