import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthenticationService } from './google-auth.service';

@Controller('google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthenticationService,
    private readonly config : ConfigService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try{
      const jwt = await this.googleAuthService.googleLogin(req);
      res.redirect(this.config.get('REDIRECT_URL_LOGIN_FRONTEND')+'?jwt=' + jwt);
    }
    catch(err){
      console.log(err)
      res.redirect(this.config.get('REDIRECT_URL_LOGIN_FRONTEND')+'?failure=true&message='+err.message);
    } 
  }
}