import { SpotifyPaginationPlaylistsDto } from 'src/api/spotify/dto/spotify-pagination-playlists.dto';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SpotifyPlaylist } from './spotify/spotify-playlist.entity';

@Entity()
export class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  strict: boolean;

  @Column(() => SpotifyPlaylist)
  spotifyPlaylist: SpotifyPlaylist;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  static dtoToEntityMapping(
    spotifyPlaylistDto: SpotifyPaginationPlaylistsDto,
  ): Playlist {
    const playlist: Playlist = new Playlist();
    const spotifyPlaylist: SpotifyPlaylist = new SpotifyPlaylist();
    spotifyPlaylist.spotifyUserId = spotifyPlaylistDto.owner.id;
    spotifyPlaylist.spotifyPlaylistId = spotifyPlaylistDto.id;
    spotifyPlaylist.spotifyUri = spotifyPlaylistDto.uri;
    playlist.name = spotifyPlaylistDto.name;
    playlist.description = spotifyPlaylistDto.description;
    playlist.spotifyPlaylist = spotifyPlaylist;
    return playlist;
  }
}
