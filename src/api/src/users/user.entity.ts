// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Tenant } from '../tenants/tenant.entity';
import { Location } from '../locations/location.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string; // You can hash the password before saving (more on that below)

  @Column()
  name!: string;

  @ManyToOne(() => Tenant)
  tenant!: string;

  @ManyToOne(() => Location)
  location!: string;
}
