import { ProductCategory, ProductUnit } from '../product.entity';
export declare class CreateProductDto {
    name: string;
    category?: ProductCategory;
    brand?: string;
    unit?: ProductUnit;
    unitCost: number;
    currentStock?: number;
    minStock?: number;
}
