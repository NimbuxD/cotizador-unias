import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
