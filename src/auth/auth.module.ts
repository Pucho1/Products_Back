import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),

    /**
     * Configuracion del JWT de forma asincrona para poder inyectar el ConfigService
     *  si no se hace asi no se pueden leer las variables de entorno en el JWT ya que no llegan a tiempo antes que se configure el modulo
     */
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SEED');
        return {
          global: true,
          secret: jwtSecret,
          signOptions: { expiresIn: '6h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
