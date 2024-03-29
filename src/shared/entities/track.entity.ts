import { SpotifyTrackDto } from 'src/api/spotify/dto/spotify-track.dto';
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
import { SpotifyTrackAnalysis } from './spotify/spotify-track-analysis.entity';
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

  @Column(() => SpotifyTrackAnalysis)
  analysis: SpotifyTrackAnalysis;

  @OneToMany(() => TaggedTrack, (tt) => tt.track, { eager: false })
  taggedTracks: TaggedTrack[];

  @ManyToMany(() => Artist, (a) => a.tracks, { eager: false, cascade: true })
  @JoinTable()
  artists: Artist[];

  static dtoToEntityMapping(trackDto: SpotifyTrackDto): Track {
    const track = new Track();
    track.artists = trackDto.artists.map((a) => Artist.dtoToEntityMapping(a));
    track.artistName = trackDto.artists[0].name;
    track.albumTitle = trackDto.album.name;
    track.title = trackDto.name;
    track.image = trackDto.album.images[0].url;
    track.duration = trackDto.duration_ms;
    track.spotifyTrack = { spotifyId: trackDto.id, uri: trackDto.uri };
    track.releaseDate = new Date(trackDto.album.release_date);
    track.popularity = trackDto.popularity;
    track.genres = trackDto.artists[0].genres;
    track.duration = trackDto.duration_ms;
    return track;
  }
}
