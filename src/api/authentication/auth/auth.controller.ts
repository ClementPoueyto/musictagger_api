import { Controller, Post, UseGuards, Body, Get, Inject, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth.dto';
import { AuthService } from './auth.services';
import { GoogleOauthGuard } from './guards/google-auth-guard';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post()
  @ApiOkResponse({description: 'Return JWT token', type : String})
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() _req) {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const token = this.authService.loginGoogle(req.user);
    res.cookie('jwt', token);
    return req.user;
  }

}