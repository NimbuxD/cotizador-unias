import { ProductService } from '../products/product.service';
import { QuotationsService } from '../quotations/quotations.service';
export declare class DashboardService {
    private readonly productService;
    private readonly quotationsService;
    constructor(productService: ProductService, quotationsService: QuotationsService);
    getSummary(): Promise<{
        inventory: {
            totalProducts: number;
            lowStockCount: number;
            lowStockAlerts: {
                id: number;
                name: string;
                currentStock: number;
                minStock: number;
                unit: import("../products/product.entity").ProductUnit;
            }[];
        };
        quotations: {
            total: number;
            pending: number;
            confirmed: number;
            cancelled: number;
            todayCount: number;
            monthlyRevenue: number;
            monthlyMaterialCost: number;
            monthlyProfit: number;
            averageQuotationValue: number;
        };
    }>;
}
