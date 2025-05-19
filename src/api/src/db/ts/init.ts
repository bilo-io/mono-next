/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppDataSource } from './data-source';
import { Location } from '../../locations/location.entity';

async function initializeDatabase(): Promise<void> {
  try {
    console.log('🟡 Initializing database...');

    await AppDataSource.initialize();
    console.log('✅ Connected to database');

    // Drop and recreate schema (use cautiously in prod!)
    await AppDataSource.synchronize(true);
    console.log('✅ Schema synchronized (tables dropped and recreated)');

    // Optional: confirm tables exist
    const tables = await AppDataSource.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public';
    `);
    console.log(
      '📦 Tables created:',
      tables?.map?.((t: any) => t?.table_name),
    );
  } catch (error) {
    console.error('❌ Failed to initialize DB:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Connection closed');
  }
}

void initializeDatabase();
