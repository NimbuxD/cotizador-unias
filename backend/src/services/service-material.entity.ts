import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NailService } from './nail-service.entity';
import { Product } from '../products/product.entity';

@Entity('service_materials')
export class ServiceMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceId: number;

  @Column()
  productId: number;

  @Column('decimal', { precision: 10, scale: 4 })
  quantityUsed: number;

  @ManyToOne(() => NailService, (service) => service.materials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceId' })
  service: NailService;

  @ManyToOne(() => Product, (product) => product.serviceMaterials, {
    eager: true,
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
