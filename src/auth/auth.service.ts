/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UserLogin } from './interfaces/user-login';
import { JwtPayload } from './interfaces/jwt-paiload';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(' createUserDto ----->', createUserDto);
    // uso el try porque alguno de estos procesos puee lanzar un error
    try {
      // eleimino  la contra del objeto resultante la separo en una variale independiente
      const { password, ...userDta } = createUserDto;

      // paso los datos por el modelo para validarlos y encripto la contra para que se grave en BD
      const createdUser = this.userModel.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        password: bcryptjs.hashSync(password, 10),
        ...userDta,
      });

      // salvo el user en BD tiene que ser con el await sino el error no se controla
      await this.userModel.save(createdUser);

      // const {password: _, ...user} = createdUser.toJSON();

      return createdUser;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists!`);
      } else {
        console.log(error);
        throw new InternalServerErrorException(
          'Something terrible happened!!!' + error,
        );
      }
    }
  }

  async login(loginData: LoginUserDto): Promise<UserLogin> {
    console.log(loginData);
    const { email, password } = loginData;

    const haveUser = await this.userModel.findOne({ where: { email } });

    console.log('haveUser ----->', haveUser);

    if (!haveUser) {
      throw new UnauthorizedException('error de autenticacion  --user invalid');
    }

    if (!bcryptjs.compareSync(password, haveUser.password!)) {
      throw new UnauthorizedException('Error de autenticacion  --pass invalid');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = haveUser;

    console.log('user ----->', user);

    return {
      user,
      token: this.tokentPaiload({ id: user.id }),
    };
  }

  async removeById(id: number) {
    const result = await this.userModel.delete(id);
    return !!result;
  }

  /**
   * Obtengo un usuario por el id
   * @param id
   * @returns un objeto de tipo usuario
   */
  async findUserById(id: number): Promise<User> {
    const user = await this.userModel.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  /**
   * @param payload es el id del user
   * @returns un tokent valido para el usuario autenticado
   */
  tokentPaiload(payload: JwtPayload): string {
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }
}
