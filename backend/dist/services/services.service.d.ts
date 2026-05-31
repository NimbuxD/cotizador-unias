import { Repository } from 'typeorm';
import { NailService } from './nail-service.entity';
import { ServiceMaterial } from './service-material.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AddMaterialDto } from './dto/add-material.dto';
import { ProductService } from '../products/product.service';
export declare class ServicesService {
    private readonly serviceRepository;
    private readonly materialRepository;
    private readonly productService;
    constructor(serviceRepository: Repository<NailService>, materialRepository: Repository<ServiceMaterial>, productService: ProductService);
    create(dto: CreateServiceDto): Promise<NailService>;
    findAll(): Promise<NailService[]>;
    findOne(id: number): Promise<NailService>;
    update(id: number, dto: UpdateServiceDto): Promise<NailService>;
    remove(id: number): Promise<void>;
    addMaterial(serviceId: number, dto: AddMaterialDto): Promise<ServiceMaterial>;
    updateMaterial(serviceId: number, materialId: number, dto: AddMaterialDto): Promise<ServiceMaterial>;
    removeMaterial(serviceId: number, materialId: number): Promise<void>;
    calculateCost(serviceId: number): Promise<{
        serviceId: number;
        serviceName: string;
        materials: Array<{
            productId: number;
            productName: string;
            quantityUsed: number;
            unit: string;
            unitCost: number;
            lineCost: number;
        }>;
        totalMaterialCost: number;
        basePrice: number;
    }>;
}
