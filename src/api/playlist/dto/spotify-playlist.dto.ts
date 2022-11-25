import { Expose } from 'class-transformer';

export class SpotifyPlaylistDto {
  @Expose()
  spotifyId: string;

  @Expose()
  spotifyPlaylistId: string;
}
