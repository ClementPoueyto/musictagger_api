import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SpotifyTrackAnalysisDto {
  @ApiProperty()
  @Expose()
  acousticness?: number;
  @ApiProperty()
  @Expose()
  danceability?: number;
  @ApiProperty()
  @Expose()
  duration_ms?: number;
  @ApiProperty()
  @Expose()
  energy?: number;
  @ApiProperty()
  @Expose()
  instrumentalness?: number;

  @ApiProperty()
  @Expose()
  key?: number;
  @ApiProperty()
  @Expose()
  liveness: number;

  @ApiProperty()
  @Expose()
  loudness?: number;

  @ApiProperty()
  @Expose()
  mode?: number;

  @ApiProperty()
  @Expose()
  speechiness?: number;

  @ApiProperty()
  @Expose()
  tempo?: number;

  @ApiProperty()
  @Expose()
  time_signature?: number;

  @ApiProperty()
  @Expose()
  valence?: number;
}
