import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifyCallback } from 'passport-jwt';
import { User } from 'src/api/user/entities/user.entity';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  private async validate(payload: string): Promise<User | never> {
    return await this.helper.validateUser(payload);
  }
}