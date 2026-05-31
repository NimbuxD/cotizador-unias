export interface ReportSummary {
  period: { from: string; to: string };
  totals: {
    completedCount: number;
    totalRevenue: number;
    totalMaterialCost: number;
    totalProfit: number;
    profitMargin: number;
  };
  byService: {
    serviceId: number;
    serviceName: string;
    count: number;
    revenue: number;
    materialCost: number;
    profit: number;
  }[];
  quotations: {
    id: number;
    clientName: string;
    date: string;
    services: string[];
    totalMaterialCost: number;
    finalPrice: number;
    profit: number;
    status: string;
  }[];
}
