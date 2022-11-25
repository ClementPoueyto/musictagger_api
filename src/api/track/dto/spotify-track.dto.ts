import { Expose } from 'class-transformer';

export class SpotifyTrackInfoDto {
  @Expose()
  spotifyId: string;

  @Expose()
  uri: string;
}
