import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { SpotifyAuthModule } from '../authentication/spotify-auth/spotify-auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SpotifyAuthModule, HttpModule],
  providers: [SpotifyService],
  controllers: [SpotifyController],
  exports: [SpotifyService],
})
export class SpotifyModule {}
