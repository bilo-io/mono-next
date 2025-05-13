import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Tenant } from '../tenants/tenant.entity';
import { Location } from '../locations/location.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  // @ManyToOne(() => Tenant)
  // tenant!: Tenant;

  // @ManyToOne(() => Location)
  // location!: Location;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: string;
}
