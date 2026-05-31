import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(dto: CreateProductDto): Promise<import("./product.entity").Product>;
    findAll(): Promise<import("./product.entity").Product[]>;
    findOne(id: number): Promise<import("./product.entity").Product>;
    update(id: number, dto: UpdateProductDto): Promise<import("./product.entity").Product>;
    remove(id: number): Promise<void>;
}
