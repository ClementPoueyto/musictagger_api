import { Expose, Type } from 'class-transformer';
import { SpotifyTrackDto } from './spotify-track.dto';

export class SpotifySeveralTracksDto {
  @Expose()
  @Type(() => SpotifyTrackDto)
  tracks: SpotifyTrackDto[];
}
