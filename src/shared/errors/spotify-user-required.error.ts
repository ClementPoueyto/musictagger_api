import { HttpException, HttpStatus } from '@nestjs/common';

export class SpotifyUserRequiredException extends HttpException {
  constructor() {
    super('Spotify login is required', HttpStatus.UNAUTHORIZED);
  }
}
