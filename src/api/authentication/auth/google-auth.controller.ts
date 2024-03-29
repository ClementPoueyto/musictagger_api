import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthenticationService } from './google-auth.service';

@Controller('google')
@ApiTags('google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthenticationService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {
    if (!req) {
      throw new Error();
    }
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    try {
      const jwt = await this.googleAuthService.googleLogin(req);
      res.redirect(
        this.config.get('GOOGLE_REDIRECT_URL_FRONTEND') + '?jwt=' + jwt,
      );
    } catch (err: any) {
      console.log(err);
      res.redirect(
        this.config.get('GOOGLE_REDIRECT_URL_FRONTEND') +
          '?failure=true&message=' +
          err.message,
      );
    }
  }
}
