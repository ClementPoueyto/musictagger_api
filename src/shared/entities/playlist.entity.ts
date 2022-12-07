import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SpotifyPlaylist } from './spotify/spotify-playlist.entity';

@Entity()
export class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column(() => SpotifyPlaylist)
  spotifyPlaylist: SpotifyPlaylist;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];
}
