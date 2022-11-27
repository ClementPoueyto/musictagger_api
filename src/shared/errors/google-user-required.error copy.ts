import { HttpException, HttpStatus } from '@nestjs/common';

export class GoogleUserRequiredException extends HttpException {
  constructor() {
    super('Google login is required', HttpStatus.UNAUTHORIZED);
  }
}
