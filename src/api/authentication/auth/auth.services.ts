import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth.dto';
import { JwtDto } from './dto/jwt.dto';
import { User } from 'src/shared/entities/user.entity';
import { UserRepository } from 'src/api/user/user.repository';

@Injectable()
export class AuthService {
  @Inject()
  private readonly userRepository: UserRepository;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async login(authLoginDto: AuthLoginDto): Promise<JwtDto> {
    const user = await this.validateUser(authLoginDto);

    return this.refreshJwtToken(user.id);
  }

  async loginGoogle(user: { id: string }) {
    return this.refreshJwtToken(user.id);
  }

  async refreshJwtToken(userId: string): Promise<JwtDto> {
    const payload = {
      userId: userId,
    };
    this.userRepository.update(userId, { lastLoginAt: new Date() });

    return new JwtDto(this.jwtService.sign(payload));
  }

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const { email, password } = authLoginDto;
    const user = await this.userRepository.getByEmailOrFail(email);
    if (!(await user.validatePassword(password))) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
