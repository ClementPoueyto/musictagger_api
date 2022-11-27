import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIdRequiredException extends HttpException {
  constructor() {
    super('Bad params : User id is required', HttpStatus.BAD_REQUEST);
  }
}
