import { User } from '../entities/user.entity';

export interface UserLogin {
  userData: User;
  accessToken: string;
}
