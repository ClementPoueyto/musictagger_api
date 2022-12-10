import { Expose } from 'class-transformer';

export class SpotifyTrackAnalysisDto {
  @Expose()
  acousticness: number;
  @Expose()
  analysis_url: string;
  @Expose()
  danceability: number;
  @Expose()
  duration_ms: number;
  @Expose()
  energy: number;
  @Expose()
  id: string;
  @Expose()
  instrumentalness: number;
  @Expose()
  key: number;
  @Expose()
  liveness: number;
  @Expose()
  loudness: number;
  @Expose()
  mode: number;
  @Expose()
  speechiness: number;
  @Expose()
  tempo: number;
  @Expose()
  time_signature: number;
  @Expose()
  track_href: string;
  @Expose()
  type: string;
  @Expose()
  uri: string;
  @Expose()
  valence: number;
}
