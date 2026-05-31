import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('catalog_items')
@Index(['userId'])
export class CatalogItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 128 })
  userId: string;

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
