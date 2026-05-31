import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AddMaterialDto } from './dto/add-material.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(dto: CreateServiceDto): Promise<import("./nail-service.entity").NailService>;
    findAll(): Promise<import("./nail-service.entity").NailService[]>;
    findOne(id: number): Promise<import("./nail-service.entity").NailService>;
    getCost(id: number): Promise<{
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
    update(id: number, dto: UpdateServiceDto): Promise<import("./nail-service.entity").NailService>;
    remove(id: number): Promise<void>;
    addMaterial(id: number, dto: AddMaterialDto): Promise<import("./service-material.entity").ServiceMaterial>;
    updateMaterial(id: number, materialId: number, dto: AddMaterialDto): Promise<import("./service-material.entity").ServiceMaterial>;
    removeMaterial(id: number, materialId: number): Promise<void>;
}
