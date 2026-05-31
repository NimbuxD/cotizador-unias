import { Injectable } from '@nestjs/common';
import { ProductService } from '../products/product.service';
import { QuotationsService } from '../quotations/quotations.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly productService: ProductService,
    private readonly quotationsService: QuotationsService,
  ) {}

  async getSummary(userId: string) {
    const [totalProducts, lowStockProducts, quotationStats] = await Promise.all([
      this.productService.getTotalCount(userId),
      this.productService.findLowStock(userId),
      this.quotationsService.getStats(userId),
    ]);

    return {
      inventory: {
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockAlerts: lowStockProducts.map((p) => ({
          id: p.id,
          name: p.name,
          currentStock: p.currentStock,
          minStock: p.minStock,
          unit: p.unit,
        })),
      },
      quotations: {
        total: quotationStats.total,
        pending: quotationStats.pending,
        confirmed: quotationStats.confirmed,
        cancelled: quotationStats.cancelled,
        todayCount: quotationStats.todayCount,
        monthlyRevenue: quotationStats.monthlyRevenue,
        monthlyMaterialCost: quotationStats.monthlyMaterialCost,
        monthlyProfit:
          Math.round(
            (quotationStats.monthlyRevenue - quotationStats.monthlyMaterialCost) * 100,
          ) / 100,
        averageQuotationValue: quotationStats.averageQuotationValue,
      },
    };
  }
}
