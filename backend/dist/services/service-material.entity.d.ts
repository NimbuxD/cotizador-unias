import { NailService } from './nail-service.entity';
import { Product } from '../products/product.entity';
export declare class ServiceMaterial {
    id: number;
    serviceId: number;
    productId: number;
    quantityUsed: number;
    service: NailService;
    product: Product;
}
