import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Cargar .env manualmente (TypeORM CLI no lo hace)
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // 👇 Busca todas las entidades dentro del proyecto
  entities: [join(__dirname, '**/*.entity.{js,ts}')],

  // 👇 Carpeta donde irá el JS compilado de las migraciones
  migrations: [join(__dirname, 'migrations/*.{js,ts}')],

  synchronize: false, // ⚠️ IMPORTANTE: desactívalo para usar migraciones
});
