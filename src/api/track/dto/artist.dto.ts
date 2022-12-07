import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SpotifyArtistDto } from 'src/api/spotify/dto/spotify-artist.dto';

export class ArtistDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  genres: string[];

  @ApiProperty()
  @Expose()
  href: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  uri: string;

  @ApiProperty()
  @Expose()
  spotifyArtist: SpotifyArtistDto;
}
