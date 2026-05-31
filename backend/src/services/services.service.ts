import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NailService } from './nail-service.entity';
import { ServiceMaterial } from './service-material.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AddMaterialDto } from './dto/add-material.dto';
import { ProductService } from '../products/product.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(NailService)
    private readonly serviceRepository: Repository<NailService>,
    @InjectRepository(ServiceMaterial)
    private readonly materialRepository: Repository<ServiceMaterial>,
    private readonly productService: ProductService,
  ) {}

  async create(dto: CreateServiceDto): Promise<NailService> {
    const service = this.serviceRepository.create(dto);
    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<NailService[]> {
    return this.serviceRepository.find({
      relations: { materials: { product: true } },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<NailService> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: { materials: { product: true } },
    });
    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }
    return service;
  }

  async update(id: number, dto: UpdateServiceDto): Promise<NailService> {
    const service = await this.findOne(id);
    Object.assign(service, dto);
    return this.serviceRepository.save(service);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }

  async addMaterial(
    serviceId: number,
    dto: AddMaterialDto,
  ): Promise<ServiceMaterial> {
    await this.findOne(serviceId);
    await this.productService.findOne(dto.productId);

    const existing = await this.materialRepository.findOne({
      where: { serviceId, productId: dto.productId },
    });
    if (existing) {
      throw new ConflictException(
        `Product #${dto.productId} is already linked to service #${serviceId}. Use PUT to update quantity.`,
      );
    }

    const material = this.materialRepository.create({
      serviceId,
      productId: dto.productId,
      quantityUsed: dto.quantityUsed,
    });
    return this.materialRepository.save(material);
  }

  async updateMaterial(
    serviceId: number,
    materialId: number,
    dto: AddMaterialDto,
  ): Promise<ServiceMaterial> {
    await this.findOne(serviceId);
    const material = await this.materialRepository.findOne({
      where: { id: materialId, serviceId },
    });
    if (!material) {
      throw new NotFoundException(
        `Material #${materialId} not found for service #${serviceId}`,
      );
    }
    Object.assign(material, dto);
    return this.materialRepository.save(material);
  }

  async removeMaterial(serviceId: number, materialId: number): Promise<void> {
    await this.findOne(serviceId);
    const material = await this.materialRepository.findOne({
      where: { id: materialId, serviceId },
    });
    if (!material) {
      throw new NotFoundException(
        `Material #${materialId} not found for service #${serviceId}`,
      );
    }
    await this.materialRepository.remove(material);
  }

  async calculateCost(serviceId: number): Promise<{
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
  }> {
    const service = await this.findOne(serviceId);

    const materials = service.materials.map((m) => {
      const unitCost = Number(m.product.unitCost);
      const qty = Number(m.quantityUsed);
      return {
        productId: m.productId,
        productName: m.product.name,
        quantityUsed: qty,
        unit: m.product.unit,
        unitCost,
        lineCost: Math.round(unitCost * qty * 100) / 100,
      };
    });

    const totalMaterialCost = materials.reduce((sum, m) => sum + m.lineCost, 0);

    return {
      serviceId: service.id,
      serviceName: service.name,
      materials,
      totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
      basePrice: Number(service.basePrice),
    };
  }
}
