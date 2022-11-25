import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SpotifyOauthGuard extends AuthGuard('spotify') {
  handleRequest(err: any, user: any, info: any) {
    console.log(err);
    console.log(info);
    if (!user && err && err.code == 'invalid_grant') {
      throw new HttpException('Spotify : ' + err.message, 400);
    }
    return user;
  }
}
