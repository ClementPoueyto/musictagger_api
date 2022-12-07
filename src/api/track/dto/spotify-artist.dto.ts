import { Expose } from 'class-transformer';

export class SpotifyArtistInfoDto {
  @Expose()
  spotifyId: string;

  @Expose()
  uri: string;
}
