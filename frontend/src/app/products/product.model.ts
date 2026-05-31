export interface Product {
  id: number;
  name: string;
  description?: string;
  unit: string;
  costPerUnit: number;
  stock: number;
  minStock: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  unit: string;
  costPerUnit: number;
  stock: number;
  minStock: number;
  category?: string;
}
