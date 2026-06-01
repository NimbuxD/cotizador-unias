export interface Product {
  id: number;
  name: string;
  brand?: string;
  unit: string;
  unitCost: number;
  currentStock: number;
  minStock: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  brand?: string;
  category?: string;
  unit?: string;
  unitCost: number;
  currentStock?: number;
  minStock?: number;
}
