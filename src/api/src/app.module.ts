import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { Tenant } from './tenants/tenant.entity';
import { Location } from './locations/location.entity';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    // Load env variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM DB connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = new URL(config.get('DATABASE_URL') as string);
        return {
          type: 'postgres',
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          username: url.username,
          password: url.password,
          database: url.pathname.replace('/', ''),
          ssl: false,
          entities: [Tenant, Location, User],
        };
      },
    }),

    // Feature modules
    TenantsModule,
    LocationsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
