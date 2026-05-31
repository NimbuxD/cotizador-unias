import { ServiceMaterial } from './service-material.entity';
export declare class NailService {
    id: number;
    name: string;
    description: string;
    estimatedDuration: number;
    basePrice: number;
    createdAt: Date;
    materials: ServiceMaterial[];
}
