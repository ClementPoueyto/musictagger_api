import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/shared/entities/user.entity';
import { AuthService } from './auth.services';
import { GoolgleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class GoogleAuthenticationService {
  constructor(private readonly authenticationService: AuthService) {}

  async googleLogin(req: { user: GoolgleAuthDto }) {
    const googleUser: GoolgleAuthDto = req.user;
    if (!googleUser) {
      return 'No user from google';
    }
    let user = await User.findOne({
      where: { email: googleUser.email },
    });
    if (user && !user.isRegisteredWithGoogle) {
      throw new UnauthorizedException('Account is not logged with Google');
    }
    if (!user) {
      user = new User();
      user.isRegisteredWithGoogle = true;
      user.email = googleUser.email;
      await User.save(user);
    }

    const refresh = await this.authenticationService.refreshJwtToken(user.id);
    return refresh.jwt_token;
  }
}
