import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HelloModule } from './hello/hello.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    AuthModule,
    HelloModule,

    // Habilitar el módulo de configuración globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión Asíncrona con TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa el módulo de configuración
      inject: [ConfigService], // Inyecta el servicio de configuración

      useFactory: (config: ConfigService) => {
        const isProd = process.env.NODE_ENV === 'production';

        // ⭐ Si estoy en producción → usar Railway DATABASE_URL
        // ⭐ Si estoy en local       → usar las variables del .env
        return {
          type: 'postgres',
          ...(isProd
            ? {
                url: config.get<string>('DATABASE_URL'),
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_NAME'),
              }),
          // type: config.get<any>('DB_TYPE'), // Lee DB_TYPE (e.g., 'postgres')
          // host: config.get<string>('DB_HOST'),
          // port: config.get<number>('DB_PORT'),
          // username: config.get<string>('DB_USERNAME'),
          // password: config.get<string>('DB_PASSWORD'),
          // database: config.get<string>('DB_NAME'),
          // // Carga automática de todas las entidades definidas
          // autoLoadEntities: true,
          // // Crea el esquema de la BD automáticamente (¡Solo para desarrollo!)
          // synchronize: true,
          autoLoadEntities: true,
          synchronize: true, // ⚠️ Para desarrollo. En prod usar migrations.
        };
      },
    }),
    CategoryModule,
  ],
})
export class AppModule {}
