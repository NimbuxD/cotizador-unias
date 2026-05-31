export interface CatalogItem {
  id: number;
  title: string;
  description?: string;
  tags?: string[];
  photos?: string[];
  quotationId?: number;
  serviceName?: string;
  createdAt?: string;
}

export interface CreateCatalogItemDto {
  title: string;
  description?: string;
  tags?: string[];
  photos?: string[];
  quotationId?: number;
  serviceName?: string;
}
