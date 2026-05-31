import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { QuotationService } from './quotation-service.entity';

export interface ExtraItem {
  name: string;
  cost: number;
}

export enum QuotationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('quotations')
@Index(['userId'])
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 128 })
  userId: string;

  @Column({ length: 200 })
  clientName: string;

  @Column({ length: 50, nullable: true })
  clientPhone: string;

  @Column({ type: 'date' })
  date: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalMaterialCost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  suggestedPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  finalPrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'varchar',
    enum: QuotationStatus,
    default: QuotationStatus.PENDING,
  })
  status: QuotationStatus;

  @Column({ type: 'time', nullable: true })
  appointmentTime: string;

  @Column({ type: 'timestamp', nullable: true })
  arrivedAt: Date;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  extras: ExtraItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  extrasCost: number;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  photos: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QuotationService, (qs) => qs.quotation, { cascade: true })
  services: QuotationService[];
}
