import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ServiceMaterial } from '../services/service-material.entity';

export enum ProductCategory {
  POLISH = 'polish',
  GEL = 'gel',
  TIPS = 'tips',
  NAIL_ART = 'nail_art',
  TOOLS = 'tools',
  SUPPLIES = 'supplies',
  OTHER = 'other',
}

export enum ProductUnit {
  ML = 'ml',
  GRAMS = 'grams',
  UNITS = 'units',
  METERS = 'meters',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({
    type: 'varchar',
    enum: ProductCategory,
    default: ProductCategory.OTHER,
  })
  category: ProductCategory;

  @Column({ length: 100, nullable: true })
  brand: string;

  @Column({
    type: 'varchar',
    enum: ProductUnit,
    default: ProductUnit.UNITS,
  })
  unit: ProductUnit;

  @Column('decimal', { precision: 10, scale: 2 })
  unitCost: number;

  @Column('decimal', { precision: 10, scale: 3, default: 0 })
  currentStock: number;

  @Column('decimal', { precision: 10, scale: 3, default: 0 })
  minStock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ServiceMaterial, (sm) => sm.product)
  serviceMaterials: ServiceMaterial[];
}
