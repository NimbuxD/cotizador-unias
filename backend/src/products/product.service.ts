import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto, userId: string): Promise<Product> {
    const product = this.productRepository.create({ ...dto, userId });
    return this.productRepository.save(product);
  }

  async findAll(userId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, userId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, userId },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto, userId: string): Promise<Product> {
    const product = await this.findOne(id, userId);
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: number, userId: string): Promise<void> {
    const product = await this.findOne(id, userId);
    await this.productRepository.remove(product);
  }

  async findLowStock(userId: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.currentStock <= product.minStock')
      .andWhere('product.minStock > 0')
      .andWhere('product.userId = :userId', { userId })
      .orderBy('product.name', 'ASC')
      .getMany();
  }

  async getTotalCount(userId: string): Promise<number> {
    return this.productRepository.count({ where: { userId } });
  }
}
