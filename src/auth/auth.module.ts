import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

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
          signOptions: { expiresIn: '60s' },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
