import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { HttpModule } from '@nestjs/axios';
import { SpotifyAuthModule } from 'api/authentication/spotify-auth/spotify-auth.module';

@Module({
  imports: [SpotifyAuthModule, HttpModule],
  providers: [SpotifyService],
  controllers: [SpotifyController],
  exports: [SpotifyService],
})
export class SpotifyModule {}
