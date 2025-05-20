// role.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  ManyToMany,
  JoinTable,
  TreeLevelColumn,
} from 'typeorm';
import { Permission } from '../permissions/permission.entity';

@Entity('roles')
@Tree('closure-table')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @TreeChildren()
  children!: Role[];

  @TreeParent()
  parent!: Role;

  @TreeLevelColumn()
  @Column({ nullable: true })
  level!: number;

  @ManyToMany(() => Permission, { cascade: true, eager: true })
  @JoinTable()
  permissions!: Permission[];
}
