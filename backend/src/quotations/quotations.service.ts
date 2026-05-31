import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Quotation, QuotationStatus } from './quotation.entity';
import { QuotationService as QuotationServiceEntity } from './quotation-service.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private readonly quotationRepository: Repository<Quotation>,
    @InjectRepository(QuotationServiceEntity)
    private readonly quotationServiceRepository: Repository<QuotationServiceEntity>,
    private readonly servicesService: ServicesService,
  ) {}

  async create(dto: CreateQuotationDto): Promise<Quotation> {
    // Calculate costs for each service
    let totalMaterialCost = 0;
    let suggestedPrice = 0;

    const serviceItems: Array<{
      serviceId: number;
      quantity: number;
      materialCost: number;
    }> = [];

    for (const item of dto.services) {
      const qty = item.quantity ?? 1;
      const costBreakdown = await this.servicesService.calculateCost(
        item.serviceId,
      );
      const materialCost =
        Math.round(costBreakdown.totalMaterialCost * qty * 100) / 100;
      const basePrice = Math.round(costBreakdown.basePrice * qty * 100) / 100;

      totalMaterialCost += materialCost;
      suggestedPrice += basePrice;

      serviceItems.push({
        serviceId: item.serviceId,
        quantity: qty,
        materialCost,
      });
    }

    totalMaterialCost = Math.round(totalMaterialCost * 100) / 100;
    suggestedPrice = Math.round(suggestedPrice * 100) / 100;

    const quotation = this.quotationRepository.create({
      clientName: dto.clientName,
      clientPhone: dto.clientPhone,
      date: dto.date,
      totalMaterialCost,
      suggestedPrice,
      finalPrice: dto.finalPrice ?? suggestedPrice,
      notes: dto.notes,
      status: QuotationStatus.PENDING,
    });

    const saved = await this.quotationRepository.save(quotation);

    // Create quotation service links
    for (const item of serviceItems) {
      const qs = this.quotationServiceRepository.create({
        quotationId: saved.id,
        serviceId: item.serviceId,
        quantity: item.quantity,
        materialCost: item.materialCost,
      });
      await this.quotationServiceRepository.save(qs);
    }

    return this.findOne(saved.id);
  }

  async findAll(): Promise<Quotation[]> {
    return this.quotationRepository.find({
      relations: { services: { service: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Quotation> {
    const quotation = await this.quotationRepository.findOne({
      where: { id },
      relations: {
        services: {
          service: {
            materials: { product: true },
          },
        },
      },
    });
    if (!quotation) {
      throw new NotFoundException(`Quotation #${id} not found`);
    }
    return quotation;
  }

  async update(id: number, dto: UpdateQuotationDto): Promise<Quotation> {
    const quotation = await this.findOne(id);

    // If services array is provided, recalculate costs
    if (dto.services && dto.services.length > 0) {
      let totalMaterialCost = 0;
      let suggestedPrice = 0;
      const serviceItems: Array<{
        serviceId: number;
        quantity: number;
        materialCost: number;
      }> = [];

      for (const item of dto.services) {
        const qty = item.quantity ?? 1;
        const costBreakdown = await this.servicesService.calculateCost(
          item.serviceId,
        );
        const materialCost =
          Math.round(costBreakdown.totalMaterialCost * qty * 100) / 100;
        const basePrice =
          Math.round(costBreakdown.basePrice * qty * 100) / 100;

        totalMaterialCost += materialCost;
        suggestedPrice += basePrice;
        serviceItems.push({ serviceId: item.serviceId, quantity: qty, materialCost });
      }

      // Remove old service links
      await this.quotationServiceRepository.delete({ quotationId: id });

      // Create new service links
      for (const item of serviceItems) {
        const qs = this.quotationServiceRepository.create({
          quotationId: id,
          serviceId: item.serviceId,
          quantity: item.quantity,
          materialCost: item.materialCost,
        });
        await this.quotationServiceRepository.save(qs);
      }

      quotation.totalMaterialCost = Math.round(totalMaterialCost * 100) / 100;
      quotation.suggestedPrice = Math.round(suggestedPrice * 100) / 100;
    }

    const { services: _services, arrivedAt, ...rest } = dto;
    Object.assign(quotation, rest);

    if (arrivedAt !== undefined) {
      quotation.arrivedAt = arrivedAt ? new Date(arrivedAt) : null;
    }

    await this.quotationRepository.save(quotation);
    return this.findOne(id);
  }

  async markArrived(id: number): Promise<Quotation> {
    const quotation = await this.findOne(id);
    quotation.arrivedAt = new Date();
    await this.quotationRepository.save(quotation);
    return this.findOne(id);
  }

  async addPhoto(id: number, photo: string): Promise<Quotation> {
    const quotation = await this.findOne(id);
    const photos = Array.isArray(quotation.photos) ? [...quotation.photos] : [];
    photos.push(photo);
    quotation.photos = photos;
    await this.quotationRepository.save(quotation);
    return this.findOne(id);
  }

  async removePhoto(id: number, index: number): Promise<Quotation> {
    const quotation = await this.findOne(id);
    const photos = Array.isArray(quotation.photos) ? [...quotation.photos] : [];
    if (index < 0 || index >= photos.length) {
      throw new NotFoundException(`Photo at index ${index} not found`);
    }
    photos.splice(index, 1);
    quotation.photos = photos;
    await this.quotationRepository.save(quotation);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const quotation = await this.findOne(id);
    await this.quotationRepository.remove(quotation);
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    todayCount: number;
    monthlyRevenue: number;
    monthlyMaterialCost: number;
    averageQuotationValue: number;
  }> {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    const [total, pending, confirmed, cancelled] = await Promise.all([
      this.quotationRepository.count(),
      this.quotationRepository.count({ where: { status: QuotationStatus.PENDING } }),
      this.quotationRepository.count({ where: { status: QuotationStatus.CONFIRMED } }),
      this.quotationRepository.count({ where: { status: QuotationStatus.CANCELLED } }),
    ]);

    const todayCount = await this.quotationRepository.count({
      where: { date: todayStr },
    });

    const monthlyQuotations = await this.quotationRepository.find({
      where: {
        date: Between(firstOfMonth, lastOfMonth),
        status: QuotationStatus.CONFIRMED,
      },
    });

    const monthlyRevenue = monthlyQuotations.reduce(
      (sum, q) => sum + Number(q.finalPrice ?? q.suggestedPrice),
      0,
    );
    const monthlyMaterialCost = monthlyQuotations.reduce(
      (sum, q) => sum + Number(q.totalMaterialCost),
      0,
    );

    const allQuotations = await this.quotationRepository.find();
    const averageQuotationValue =
      allQuotations.length > 0
        ? allQuotations.reduce(
            (sum, q) => sum + Number(q.finalPrice ?? q.suggestedPrice),
            0,
          ) / allQuotations.length
        : 0;

    return {
      total,
      pending,
      confirmed,
      cancelled,
      todayCount,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      monthlyMaterialCost: Math.round(monthlyMaterialCost * 100) / 100,
      averageQuotationValue: Math.round(averageQuotationValue * 100) / 100,
    };
  }
}
