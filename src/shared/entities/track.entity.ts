import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Artist } from './artist.entity';
import { SpotifyTrack } from './spotify/spotify-track.entity';
import { TaggedTrack } from './tagged-track.entity';

@Entity()
@Unique(['artistName', 'title', 'albumTitle'])
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column(() => SpotifyTrack)
  spotifyTrack: SpotifyTrack;

  @Column({ type: 'varchar' })
  artistName: string;

  @Column({ type: 'varchar' })
  albumTitle: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column('text', { array: true, default: [] })
  genres: string[];

  @Column({ type: 'timestamp', nullable: true, default: null })
  releaseDate: Date;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ nullable: true })
  duration?: number;

  @Column({ nullable: true })
  popularity?: number;

  @OneToMany(() => TaggedTrack, (tt) => tt.track, { eager: false })
  taggedTracks: TaggedTrack[];

  @ManyToMany(() => Artist, (a) => a.tracks, { eager: false, cascade: true })
  @JoinTable()
  artists: Artist[];
}
