import { Column } from 'typeorm';

export class SpotifyTrack {
  @Column()
  spotifyId: string;

  @Column()
  uri: string;
}
