import { ApiProperty } from '@nestjs/swagger';

export class SpotifyAccessTokenDto {
  constructor(partial: any) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'Access token',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description: 'Token type',
    type: String,
  })
  token_type: string;

  @ApiProperty({
    description: 'expire time',
    type: Number,
  })
  expires_in: number;

  @ApiProperty({
    description: 'scope',
    type: String,
  })
  scope: string;
}
