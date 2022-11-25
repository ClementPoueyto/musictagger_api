import { Exclude, Expose, Type } from 'class-transformer';
import { SpotifyAlbumDto } from './spotify-album.dto';
import { SpotifyArtistDto } from './spotify-artist.dto';
import { SpotifyExternalIdDto } from './spotify-external-id.dto';
import { SpotifyExternalUrlsDto } from './spotify-external-urls.dto';
import { SpotifyRestrictionDto } from './spotify-restriction.dto';

export class SpotifyLinkedFromDto {
  @Expose()
  @Type(() => SpotifyAlbumDto)
  album: SpotifyAlbumDto;

  @Expose()
  @Type(() => SpotifyArtistDto)
  artists: SpotifyArtistDto[];

  @Exclude()
  available_markets: string[];

  @Expose()
  disc_number: number;

  @Expose()
  duration_ms: number;

  @Expose()
  explicit: boolean;

  @Expose()
  @Type(() => SpotifyExternalIdDto)
  external_ids: SpotifyExternalIdDto;

  @Type(() => SpotifyExternalUrlsDto)
  external_urls: SpotifyExternalUrlsDto;

  @Expose()
  href: string;

  @Expose()
  id: string;

  @Expose()
  is_playable: boolean;

  @Type(() => SpotifyLinkedFromDto)
  linked_from: SpotifyLinkedFromDto;

  @Type(() => SpotifyRestrictionDto)
  restrictions: SpotifyRestrictionDto;

  @Expose()
  name: string;

  @Expose()
  popularity: number;

  @Expose()
  preview_url: string;

  @Expose()
  track_number: number;

  @Expose()
  type: string;

  @Expose()
  uri: string;

  @Expose()
  is_local: boolean;
}
