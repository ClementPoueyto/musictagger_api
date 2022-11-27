import { HttpStatus, Module, OnModuleInit } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SpotifyAuthModule } from '../authentication/spotify-auth/spotify-auth.module';
import { SpotifyUnauthorizedException } from './errors/spotify-unauthorized.error';
import { SpotifyBadRequestException } from './errors/spotify-unauthorized.error copy';

@Module({
  imports: [SpotifyAuthModule, HttpModule],
  providers: [SpotifyService],
  controllers: [SpotifyController],
  exports: [SpotifyService],
})
export class SpotifyModule implements OnModuleInit {
  constructor(private httpService: HttpService) {}
  onModuleInit() {
    this.httpService.axiosRef.interceptors.response.use((config) => {
      //console.log(config);
      return config;
    });
    this.httpService.axiosRef.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response.status === HttpStatus.BAD_REQUEST) {
          throw new SpotifyBadRequestException(
            error.response.data.error.message,
          );
        }
        if (error.response.status === HttpStatus.UNAUTHORIZED) {
          throw new SpotifyUnauthorizedException(
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
