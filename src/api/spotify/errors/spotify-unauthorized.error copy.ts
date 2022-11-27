import { HttpException, HttpStatus } from '@nestjs/common';

export class SpotifyBadRequestException extends HttpException {
  constructor(message: string) {
    super('Spotify bad request exception : ' + message, HttpStatus.BAD_REQUEST);
  }
}
