import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Quotation, QuotationStatus } from '../quotations/quotation.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Quotation)
    private readonly quotationRepository: Repository<Quotation>,
  ) {}

  async getSummary(
    from?: string,
    to?: string,
  ): Promise<{
    period: { from: string; to: string };
    totals: {
      completedCount: number;
      totalRevenue: number;
      totalMaterialCost: number;
      totalProfit: number;
      profitMargin: number;
    };
    byService: Array<{
      serviceId: number;
      serviceName: string;
      count: number;
      revenue: number;
      materialCost: number;
      profit: number;
    }>;
    quotations: Array<{
      id: number;
      clientName: string;
      date: string;
      services: string[];
      totalMaterialCost: number;
      finalPrice: number;
      profit: number;
      status: string;
    }>;
  }> {
    // Build where clause
    const where: Record<string, unknown> = {
      status: QuotationStatus.COMPLETED,
    };

    if (from && to) {
      where.date = Between(from, to);
    } else if (from) {
      where.date = MoreThanOrEqual(from);
    } else if (to) {
      where.date = LessThanOrEqual(to);
    }

    const quotations = await this.quotationRepository.find({
      where,
      relations: { services: { service: true } },
      order: { date: 'ASC' },
    });

    // Compute totals
    let totalRevenue = 0;
    let totalMaterialCost = 0;

    // Accumulate per-service stats
    const serviceMap = new Map<
      number,
      {
        serviceId: number;
        serviceName: string;
        count: number;
        revenue: number;
        materialCost: number;
      }
    >();

    const quotationRows: Array<{
      id: number;
      clientName: string;
      date: string;
      services: string[];
      totalMaterialCost: number;
      finalPrice: number;
      profit: number;
      status: string;
    }> = [];

    for (const q of quotations) {
      const finalPrice = Number(q.finalPrice ?? q.suggestedPrice);
      const matCost = Number(q.totalMaterialCost);
      const profit = finalPrice - matCost;

      totalRevenue += finalPrice;
      totalMaterialCost += matCost;

      const serviceNames: string[] = [];

      for (const qs of q.services ?? []) {
        const svcId = qs.serviceId;
        const svcName = qs.service?.name ?? `Service #${svcId}`;
        serviceNames.push(svcName);

        // Revenue per service: proportional share based on material cost ratio,
        // or split evenly when total material cost is 0.
        const svcMaterialCost = Number(qs.materialCost);
        let svcRevenue: number;
        if (matCost > 0) {
          svcRevenue = (svcMaterialCost / matCost) * finalPrice;
        } else {
          const count = q.services.length || 1;
          svcRevenue = finalPrice / count;
        }

        if (!serviceMap.has(svcId)) {
          serviceMap.set(svcId, {
            serviceId: svcId,
            serviceName: svcName,
            count: 0,
            revenue: 0,
            materialCost: 0,
          });
        }
        const entry = serviceMap.get(svcId)!;
        entry.count += 1;
        entry.revenue += svcRevenue;
        entry.materialCost += svcMaterialCost;
      }

      quotationRows.push({
        id: q.id,
        clientName: q.clientName,
        date: q.date,
        services: serviceNames,
        totalMaterialCost: Math.round(matCost * 100) / 100,
        finalPrice: Math.round(finalPrice * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        status: q.status,
      });
    }

    const totalProfit = totalRevenue - totalMaterialCost;
    const profitMargin =
      totalRevenue > 0
        ? Math.round((totalProfit / totalRevenue) * 10000) / 100
        : 0;

    const byService = Array.from(serviceMap.values()).map((s) => ({
      serviceId: s.serviceId,
      serviceName: s.serviceName,
      count: s.count,
      revenue: Math.round(s.revenue * 100) / 100,
      materialCost: Math.round(s.materialCost * 100) / 100,
      profit: Math.round((s.revenue - s.materialCost) * 100) / 100,
    }));

    // Determine period labels
    const periodFrom =
      from ?? (quotations.length > 0 ? quotations[0].date : '');
    const periodTo =
      to ?? (quotations.length > 0 ? quotations[quotations.length - 1].date : '');

    return {
      period: { from: periodFrom, to: periodTo },
      totals: {
        completedCount: quotations.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
        totalProfit: Math.round(totalProfit * 100) / 100,
        profitMargin,
      },
      byService,
      quotations: quotationRows,
    };
  }
}
