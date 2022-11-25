import { ApiProperty } from '@nestjs/swagger';

export class SpotifyUserDto {
  @ApiProperty({
    description: 'Id du compte Spotify',
    type: String,
  })
  spotifyId: string;

  @ApiProperty({
    description: "Token JWT d'acces ",
    type: String,
  })
  spotifyAccessToken: string;

  @ApiProperty({
    description: "Token permettant de mettre à jour le Token d'acces",
    type: String,
  })
  spotifyRefreshToken: string;

  @ApiProperty({
    description: "Temps de validite du token d'acces",
    type: Number,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Date de creation du token',
    type: Date,
  })
  tokenCreation: Date;
}
