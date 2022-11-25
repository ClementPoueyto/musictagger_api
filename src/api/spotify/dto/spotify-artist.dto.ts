import { Expose } from 'class-transformer';
import { SpotifyExternalUrlsDto } from './spotify-external-urls.dto';
import { SpotifyFollowersDto } from './spotify-followers.dto';
import { SpotifyImageDto } from './spotify-image.dto';

export class SpotifyArtistDto {
  @Expose()
  external_urls: SpotifyExternalUrlsDto;

  @Expose()
  followers: SpotifyFollowersDto;

  @Expose()
  genres: string[];

  @Expose()
  href: string;

  @Expose()
  id: string;

  @Expose()
  images: SpotifyImageDto[];

  @Expose()
  name: string;

  @Expose()
  popularity: number;

  @Expose()
  type: string;

  @Expose()
  uri: string;
}
