import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SpotifyExternalUrlsDto } from './spotify-external-urls.dto';
import { SpotifyFollowersDto } from './spotify-followers.dto';
import { SpotifyImageDto } from './spotify-image.dto';
import { SpotifyOwnerDto } from './spotify-owner.dto';
import { SpotifyPaginationTracksDto } from './spotify-pagination-tracks.dto';

export class SpotifyPaginationPlaylistsDto {
  @ApiProperty()
  @Expose()
  collaborative: boolean;

  @ApiProperty()
  @Expose()
  description: string;

  @Expose()
  @ApiProperty()
  external_urls: SpotifyExternalUrlsDto;

  @Expose()
  @ApiProperty()
  followers: SpotifyFollowersDto;

  @Expose()
  @ApiProperty()
  href: string;

  @Expose()
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Expose()
  images: SpotifyImageDto[];

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  owner: SpotifyOwnerDto;

  @ApiProperty()
  @Expose()
  public: boolean;

  @ApiProperty()
  @Expose()
  snapshot_id: string;

  @ApiProperty()
  @Expose()
  tracks: SpotifyPaginationTracksDto;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  uri: string;
}
