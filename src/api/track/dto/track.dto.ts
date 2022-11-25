import { ApiProperty } from '@nestjs/swagger';
import { TaggedTrackDto } from 'api/tagged-track/dto/tagged-track.dto';
import { Expose, Type } from 'class-transformer';
import { SpotifyTrackInfoDto } from './spotify-track.dto';

export class TrackDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  @Type(() => SpotifyTrackInfoDto)
  spotifyTrack: SpotifyTrackInfoDto;

  @ApiProperty()
  @Expose()
  artistName: string;

  @Expose()
  @ApiProperty()
  albumTitle: string;

  @Expose()
  @ApiProperty()
  artists: string[];

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  image: string;

  @Expose()
  @ApiProperty()
  duration: number;

  @Expose()
  @ApiProperty()
  releaseDate: Date;

  @Expose()
  @ApiProperty()
  popularity: number;

  @Expose()
  @Type(() => TaggedTrackDto)
  taggedTracks: TaggedTrackDto[];
}
