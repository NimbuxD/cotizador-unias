import { ServiceMaterial } from '../services/service-material.entity';
export declare enum ProductCategory {
    POLISH = "polish",
    GEL = "gel",
    TIPS = "tips",
    NAIL_ART = "nail_art",
    TOOLS = "tools",
    SUPPLIES = "supplies",
    OTHER = "other"
}
export declare enum ProductUnit {
    ML = "ml",
    GRAMS = "grams",
    UNITS = "units",
    METERS = "meters"
}
export declare class Product {
    id: number;
    name: string;
    category: ProductCategory;
    brand: string;
    unit: ProductUnit;
    unitCost: number;
    currentStock: number;
    minStock: number;
    createdAt: Date;
    updatedAt: Date;
    serviceMaterials: ServiceMaterial[];
}
