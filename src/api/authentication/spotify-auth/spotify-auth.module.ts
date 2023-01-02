import { HttpStatus, Module, OnModuleInit } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyOauthStrategy } from './strategies/spotify-oauth.strategy';
import { SpotifyAuthController } from './spotify-auth.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SpotifyAuthBadRequestException } from './errors/spotify-auth-unauthorized.error copy';
import { SpotifyAuthUnauthorizedException } from './errors/spotify-auth-unauthorized.error';
import { SpotifyAuthRepository } from './spotify-auth.repository';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
  ],
  providers: [SpotifyAuthService, SpotifyOauthStrategy, SpotifyAuthRepository],
  controllers: [SpotifyAuthController],
  exports: [SpotifyAuthService],
})
export class SpotifyAuthModule implements OnModuleInit {
  constructor(private httpService: HttpService) {}
  onModuleInit() {
    this.httpService.axiosRef.interceptors.response.use((config) => {
      //console.log(config);
      return config;
    });
    this.httpService.axiosRef.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        console.log(error);
        if (error.response.status === HttpStatus.BAD_REQUEST) {
          throw new SpotifyAuthBadRequestException(
            error.response.data.error.message,
          );
        }
        if (error.response.status === HttpStatus.UNAUTHORIZED) {
          throw new SpotifyAuthUnauthorizedException(
            error.response.data.error.message,
          );
        }
        if (error.response.status !== HttpStatus.OK) {
          throw new Error();
        }
      },
    );
  }
}
