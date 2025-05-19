import { AppDataSource } from './data-source';
import { Tenant } from '../../tenants/tenant.entity';
import { Location } from '../../locations/location.entity';
import { User } from '../../users/user.entity';
import * as utils from './utils';

async function seedDatabase(): Promise<void> {
  try {
    console.log('🟡 Seeding database...');

    // Initialize the database connection
    await AppDataSource.initialize();
    console.log('✅ Connected to database');

    // Clean the existing data (truncate tables)
    // await AppDataSource.createQueryBuilder().delete().from(User).execute();
    // await AppDataSource.createQueryBuilder().delete().from(Location).execute();
    // await AppDataSource.createQueryBuilder().delete().from(Tenant).execute();

    console.log('🔌 Tables cleared');

    // Create tenants
    const tenants = Array.from({ length: 5 }).map(() => {
      const tenant = new Tenant();
      tenant.name = utils.generateBusinessName();
      return tenant;
    });

    await AppDataSource.manager.save(tenants);
    console.log('✅ Tenants created');

    // Create locations
    const locations = Array.from({ length: 10 }).map(() => {
      const location = new Location();
      location.name = utils.generateAddress().street;
      location.address = utils.generateAddress().fullAddress;
      location.lat = utils.generateLat();
      location.lon = utils.generateLon();
      return location;
    });

    await AppDataSource.manager.save(locations);
    console.log('✅ Locations created');

    // Create users
    const users = Array.from({ length: 10_000 }).map(() => {
      const userDetails = utils.generateUserDetails();
      const user = new User();

      user.email = `${userDetails.userName}@example.com`;
      user.password = 'password123'; // Example password
      user.name = `${userDetails.fullName}`;

      return user;
    });

    await AppDataSource.manager.save(users);
    console.log('✅ Users created');
  } catch (error) {
    console.error('❌ Failed to seed DB:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Connection closed');
  }
}

void seedDatabase();
