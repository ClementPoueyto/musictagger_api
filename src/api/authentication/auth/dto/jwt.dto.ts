import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  constructor(token: string) {
    this.jwt_token = token;
  }

  @ApiProperty()
  jwt_token: string;
}
