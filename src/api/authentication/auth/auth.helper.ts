import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'shared/entities/user.entity';

@Injectable()
export class AuthHelper {
  constructor(private readonly jwt: JwtService) {
    this.jwt = jwt;
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, undefined);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<User> {
    const user = await User.findOne({
      where: { id: decoded.userId },
      relations: { spotifyUser: true },
    });
    if (!user) {
      throw new Error('no user');
    }
    return user;
  }

  // Generate JWT Token
  public generateToken(user: User): string {
    return this.jwt.sign({ id: user.id, email: user.email });
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }
}
