import { TaggedTrack } from 'api/tagged-track/entities/tagged-track.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SpotifyTrack } from './spotify-track.entity';

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

  @Column('text', { array: true })
  artists: string[];

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
}
