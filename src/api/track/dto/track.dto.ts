import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SpotifyTrackAnalysisDto } from 'src/api/spotify/dto/spotify-track-analysis.dto';
import { TaggedTrackDto } from 'src/api/tagged-track/dto/tagged-track.dto';
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

  @Expose()
  @Type(() => SpotifyTrackAnalysisDto)
  analyse: SpotifyTrackAnalysisDto;

  @Expose()
  @ApiProperty()
  genres: string[];
}
