import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { UserRepository } from 'src/api/user/user.repository';
import { User } from 'src/shared/entities/user.entity';
import { GoogleUserRequiredException } from 'src/shared/errors/google-user-required.error copy';
import { AuthService } from './auth.services';
import { GoolgleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class GoogleAuthenticationService {
  @Inject()
  private readonly userRepository: UserRepository;

  constructor(private readonly authenticationService: AuthService) {}

  async googleLogin(req: { user: GoolgleAuthDto }) {
    const googleUser: GoolgleAuthDto = req.user;
    if (!googleUser) {
      throw new GoogleUserRequiredException();
    }
    let user = await User.findOne({
      where: { email: googleUser.email },
    });
    if (user && !user.isRegisteredWithGoogle) {
      throw new GoogleUserRequiredException();
    }
    if (!user) {
      user = new User();
      user.isRegisteredWithGoogle = true;
      user.email = googleUser.email;
      await this.userRepository.save(user);
    }

    const refresh = await this.authenticationService.refreshJwtToken(user.id);
    return refresh.jwt_token;
  }
}
