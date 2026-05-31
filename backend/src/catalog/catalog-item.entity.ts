import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('catalog_items')
export class CatalogItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @Column({ type: 'jsonb', default: [] })
  photos: string[];

  @Column({ nullable: true })
  quotationId: number;

  @Column({ nullable: true })
  serviceName: string;

  @CreateDateColumn()
  createdAt: Date;
}
