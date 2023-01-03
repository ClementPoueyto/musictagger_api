import { SpotifyArtistDto } from 'src/api/spotify/dto/spotify-artist.dto';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SpotifyArtist } from './spotify/spotify-artist.entity';
import { Track } from './track.entity';

@Entity()
@Unique(['spotifyArtist.spotifyArtistId'])
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column('text', { array: true, default: [] })
  genres?: string[];

  @Column({ nullable: true })
  popularity?: number;

  @Column()
  type: string;

  @Column(() => SpotifyArtist)
  spotifyArtist: SpotifyArtist;

  @ManyToMany(() => Track, (t) => t.artists, {
    eager: false,
    onUpdate: 'CASCADE',
  })
  tracks: Track[];

  static dtoToEntityMapping(artistDto: SpotifyArtistDto): Artist {
    const artist = new Artist();
    const spotifyArtist = new SpotifyArtist();
    artist.name = artistDto.name;
    artist.genres = artistDto.genres;
    artist.popularity = artistDto.popularity;
    artist.type = artistDto.type;
    spotifyArtist.spotifyArtistId = artistDto.id;
    spotifyArtist.spotifyUri = artistDto.uri;
    artist.spotifyArtist = spotifyArtist;
    return artist;
  }
}
