import { Controller, Post, UseGuards, Body, Get, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth.dto';
import { AuthService } from './auth.services';

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



}