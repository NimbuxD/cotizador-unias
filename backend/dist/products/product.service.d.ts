import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    create(dto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    update(id: number, dto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
    findLowStock(): Promise<Product[]>;
    getTotalCount(): Promise<number>;
}
