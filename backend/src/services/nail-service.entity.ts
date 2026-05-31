import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ServiceMaterial } from './service-material.entity';

@Entity('nail_services')
@Index(['userId'])
export class NailService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 128 })
  userId: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  estimatedDuration: number; // in minutes

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  basePrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ServiceMaterial, (sm) => sm.service, { cascade: true })
  materials: ServiceMaterial[];
}
