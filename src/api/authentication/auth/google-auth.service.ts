import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.services';
import { GoolgleAuthDto } from './dto/google-auth.dto';
 
@Injectable()
export class GoogleAuthenticationService {

  constructor(
    private readonly authenticationService: AuthService
  ) {
   
  }

  async googleLogin(req ) {
    const googleUser : GoolgleAuthDto = req.user
    let user :User ;
    
       user  = await User.findOne({
        where: {email: googleUser.email },
      });
      if(!user.isRegisteredWithGoogle){
        throw new UnauthorizedException('Account is not logged with Google')
      }
      if (!user) {
        user = new User();
        user.isRegisteredWithGoogle = true;
        user.email = googleUser.email;
        User.save(user);
      }
      if (!googleUser) {
      return 'No user from google'
    }

    return (await this.authenticationService.refreshJwtToken(user.id)).jwt_token
    
  }
 

}