import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quotation } from './quotation.entity';
import { NailService } from '../services/nail-service.entity';

@Entity('quotation_services')
export class QuotationService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quotationId: number;

  @Column()
  serviceId: number;

  @Column({ default: 1 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  materialCost: number;

  @ManyToOne(() => Quotation, (q) => q.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quotationId' })
  quotation: Quotation;

  @ManyToOne(() => NailService, { eager: true })
  @JoinColumn({ name: 'serviceId' })
  service: NailService;
}
