import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Inject,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth.dto';
import { AuthService } from './auth.services';
import { JwtDto } from './dto/jwt.dto';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guards';
import { NotFoundInterceptor } from 'src/shared/interceptors/not-found.interceptor';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post()
  @UseInterceptors(NotFoundInterceptor)
  @ApiOkResponse({ description: 'Return JWT token', type: JwtDto })
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Get('refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'refresh JWT token', type: JwtDto })
  async refresh_jwt_token(@Request() req: any) {
    return this.authService.refreshJwtToken(req.user.id);
  }
}
