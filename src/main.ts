// import * as crypto from 'crypto';
import { webcrypto } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
// (global as any).crypto = crypto;

// Inyectar crypto solo en producción
if (process.env.NODE_ENV === 'production') {
  if (!globalThis.crypto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (globalThis as any).crypto = webcrypto;
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'https://elputooutlet.es',
      'https://backend.elputooutlet.es',
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
