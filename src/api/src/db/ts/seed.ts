import { AppDataSource } from './data-source';
import { Tenant } from '../../tenants/tenant.entity';
import { Location } from '../../locations/location.entity';
import { User } from '../../users/user.entity';
import { Role } from '../../roles/role.entity';
import { Permission } from '../../permissions/permission.entity';
import * as utils from './utils';

async function seedDatabase(): Promise<void> {
  try {
    console.log('🟡 Seeding database...');

    await AppDataSource.initialize();
    console.log('✅ Connected to database');

    // Uncomment if you want to clean the tables before seeding
    await AppDataSource.createQueryBuilder().delete().from(User).execute();
    await AppDataSource.createQueryBuilder().delete().from(Location).execute();
    await AppDataSource.createQueryBuilder().delete().from(Role).execute();
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Permission)
      .execute();
    await AppDataSource.createQueryBuilder().delete().from(Tenant).execute();

    console.log('🔌 Tables cleared (if enabled)');

    // ──────────────────────────────────────────────
    // TENANTS
    // ──────────────────────────────────────────────
    const tenants = Array.from({ length: 5 }).map(() => {
      const tenant = new Tenant();
      tenant.name = utils.generateBusinessName();
      return tenant;
    });

    await AppDataSource.manager.save(tenants);
    console.log('✅ Tenants created');

    // ──────────────────────────────────────────────
    // LOCATIONS
    // ──────────────────────────────────────────────
    const locations = Array.from({ length: 10 }).map(() => {
      const addr = utils.generateAddress();
      const location = new Location();
      location.name = addr.street;
      location.address = addr.fullAddress;
      location.lat = utils.generateLat();
      location.lon = utils.generateLon();
      return location;
    });

    await AppDataSource.manager.save(locations);
    console.log('✅ Locations created');

    // ──────────────────────────────────────────────
    // PERMISSIONS
    // ──────────────────────────────────────────────
    const permissionNames = [
      'read:users',
      'write:users',
      'update:users',
      'delete:users',
      'read:roles',
      'write:roles',
      'read:tenants',
      'write:tenants',
    ];

    const permissionRepo = AppDataSource.getRepository(Permission);

    const permissions: Permission[] = [];

    for (const name of permissionNames) {
      let permission = await permissionRepo.findOneBy({ name });

      if (!permission) {
        permission = permissionRepo.create({ name });
        await permissionRepo.save(permission);
        console.log(`🆕 Created permission: ${name}`);
      } else {
        console.log(`🔁 Reused permission: ${name}`);
      }

      permissions.push(permission);
    }

    console.log('✅ Permissions created or reused');

    // ──────────────────────────────────────────────
    // ROLES
    // ──────────────────────────────────────────────
    const superAdmin = new Role();
    superAdmin.name = 'Super Admin';
    superAdmin.permissions = permissions;
    // superAdmin.level = 0;

    const admin = new Role();
    admin.name = 'Admin';
    admin.parent = superAdmin;
    // admin.level = 1;
    admin.permissions = permissions.filter(
      (p) => !p.name.startsWith('write:tenants'),
    );

    const manager = new Role();
    manager.name = 'Manager';
    manager.parent = admin;
    // manager.level = 2;
    manager.permissions = permissions.filter((p) =>
      ['read:users', 'read:roles', 'read:tenants'].includes(p.name),
    );

    const viewer = new Role();
    viewer.name = 'Viewer';
    viewer.parent = manager;
    // viewer.level = 3;
    viewer.permissions = permissions.filter((p) => p.name.startsWith('read:'));

    await AppDataSource.manager.save([superAdmin, admin, manager, viewer]);
    console.log('✅ Roles created with hierarchy');

    // ──────────────────────────────────────────────
    // USERS
    // ──────────────────────────────────────────────
    const userRepo = AppDataSource.getRepository(User);
    const roles = [superAdmin, admin, manager, viewer];

    const users = Array.from({ length: 10_000 }).map(() => {
      const details = utils.generateUserDetails();
      const user = new User();

      user.email = `${details.userName}@example.com`;
      user.password = 'password123';
      user.name = details.fullName;
      user.roles = utils.pickRandomSubset(roles);
      // You can uncomment the next line if your User entity has tenant
      // user.tenant = utils.pickRandom(tenants);

      return user;
    });

    // Save in batches to avoid memory issues with 10,000 users
    const batchSize = 1000;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await userRepo.save(batch);
      console.log(`✅ Users saved: ${i + batch.length}/${users.length}`);
    }

    console.log('✅ All users created and assigned roles');
  } catch (error) {
    console.error('❌ Failed to seed DB:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Connection closed');
  }
}

void seedDatabase();
