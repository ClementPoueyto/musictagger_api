import { HttpException, HttpStatus } from '@nestjs/common';

export class SpotifyUnauthorizedException extends HttpException {
  constructor(message: string) {
    super(
      'Spotify unauthorized exception : ' + message,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
