import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TrackDto } from 'src/api/track/dto/track.dto';
import { SpotifyPlaylistDto } from './spotify-playlist.dto';

export class PlaylistDto {
  @ApiProperty()
  @Expose()
  public id: string;

  @Expose()
  @ApiProperty()
  @Type(() => SpotifyPlaylistDto)
  spotifyPlaylist: SpotifyPlaylistDto;

  @Expose()
  @ApiProperty()
  tracks: TrackDto[];
}
