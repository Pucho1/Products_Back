import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  category: Category | null;

  @Column('text', { array: true })
  images: string[];

  @Column()
  quantity: number;
}
