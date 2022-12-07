import { Column } from 'typeorm';

export class SpotifyArtist {
  @Column()
  spotifyArtistId: string;

  @Column()
  spotifyUri: string;
}
