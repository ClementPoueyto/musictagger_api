import { Expose } from 'class-transformer';

export class SpotifyRestrictionDto {
  @Expose()
  reason: string;
}
