import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyOauthStrategy } from './strategies/spotify-oauth.strategy';
import { SpotifyAuthController } from './spotify-auth.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    SharedModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
  ],
  providers: [SpotifyAuthService, SpotifyOauthStrategy],
  controllers: [SpotifyAuthController],
  exports: [SpotifyAuthService],
})
export class SpotifyAuthModule {}
