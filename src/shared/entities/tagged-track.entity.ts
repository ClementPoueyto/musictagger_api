import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Track } from './track.entity';

@Entity()
@Unique(['userId', 'track', 'tags'])
export class TaggedTrack extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text', array: true })
  tags: string[];

  @ManyToOne(() => Track, (t) => t.taggedTracks)
  @JoinColumn()
  track: Track;

  @Column({ type: 'varchar' })
  userId: string;
}
