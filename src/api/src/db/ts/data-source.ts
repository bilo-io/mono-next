import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Tenant } from '../../tenants/tenant.entity';
import { Location } from '../../locations/location.entity';
import { User } from '../../users/user.entity';
import { Role } from '../../roles/role.entity';
import { Permission } from '../../permissions/permission.entity';

// const { DATABASE_URL } = process.env;
const DATABASE_URL = 'postgres://bilolwabona:deluxe@localhost:5432/medical';
console.log({ DATABASE_URL });
const url = new URL(DATABASE_URL as string);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: url.username,
  password: url.password,
  database: url.pathname.replace('/', ''),
  synchronize: true, // only in dev — don't use in prod
  logging: false,
  entities: [Tenant, Location, User, Role, Permission],
  migrations: [],
  subscribers: [],
});
