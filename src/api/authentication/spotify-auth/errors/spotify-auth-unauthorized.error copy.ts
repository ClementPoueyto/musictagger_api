import { HttpException, HttpStatus } from '@nestjs/common';

export class SpotifyAuthBadRequestException extends HttpException {
  constructor(message: string) {
    super('Spotify bad request exception : ' + message, HttpStatus.BAD_REQUEST);
  }
}
