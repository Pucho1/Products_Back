import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// import { Photo } from '../photos/photo.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  //   @OneToMany(() => Photo, (photo) => photo.user)
  //   photos: Photo[];

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];
}
