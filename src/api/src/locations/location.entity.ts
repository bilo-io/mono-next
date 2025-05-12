import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Tenant)
  tenant!: Tenant;

  @Column()
  address!: string;

  @Column()
  lat!: number;

  @Column()
  lon!: number;
}
