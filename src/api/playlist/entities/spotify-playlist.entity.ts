import { Column } from 'typeorm';

export class SpotifyPlaylist {
  @Column()
  spotifyUserId: string;

  @Column()
  spotifyUri: string;

  @Column()
  spotifyPlaylistId: string;
}
