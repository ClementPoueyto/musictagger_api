import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-spotify';

@Injectable()
export class SpotifyOauthStrategy extends PassportStrategy(
  Strategy, 'spotify'
){

  constructor(@Inject(ConfigService) config: ConfigService) {
      super(
        {
          clientID: config.get('SPOTIFY_CLIENT_ID'),
          clientSecret: config.get('SPOTIFY_CLIENT_SECRET'),
          callbackURL: config.get('CALLBACK_URL'),
          scope:
            'user-read-private user-read-email playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public user-library-read user-library-modify',
        },
        (
          accessToken: string,
          refreshToken: string,
          expires_in: number,
          profile: Profile,
          done: VerifyCallback
        ): void => {
            return done(null, profile, { accessToken, refreshToken, expires_in });
          
        },
      );
    
  }
}