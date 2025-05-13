import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // @ManyToOne(() => Tenant)
  // tenant!: Tenant;

  @Column()
  address!: string;

  @Column('text')
  lat!: string;

  @Column('text')
  lon!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: string;
}
