import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { CreateSpotifyPlaylistDto } from './dto/create-spotify-playlist.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { Track } from 'shared/entities/track.entity';
import { SpotifyPlaylist } from 'shared/entities/spotify-playlist.entity';
import { Playlist } from 'shared/entities/playlist.entity';
import { UserService } from 'api/user/user.services';
import { TaggedTrackService } from 'api/tagged-track/tagged-track.service';
import { SpotifyService } from 'api/spotify/spotify.service';
import { SpotifyTrackDto } from 'api/spotify/dto/spotify-track.dto';
import { SpotifyPaginationPlaylistsDto } from 'api/spotify/dto/spotify-pagination-playlists.dto';

@Injectable()
export class PlaylistService {
  @Inject()
  private readonly spotifyService: SpotifyService;

  @Inject()
  private readonly userService: UserService;

  @Inject(forwardRef(() => TaggedTrackService))
  private readonly taggedtrackService: TaggedTrackService;

  async getPlaylistById(userId: string, playlistId: string) {
    const playlist = await Playlist.findOne({ where: { id: playlistId } });
    if (!playlist)
      throw new NotFoundException('no playlist found with id ' + playlistId);
    if (playlist.userId != userId) throw new UnauthorizedException();
    return playlist;
  }

  async getPlaylistTracks(
    userId: string,
    playlistId: string,
    page = 0,
    limit = 50,
  ) {
    if (!limit || limit > 50) {
      limit = 50;
    }
    if (!page) {
      page = 0;
    }
    const playlist = await this.getPlaylistById(userId, playlistId);
    const tracks = await this.spotifyService.getPlaylistTracks(
      playlist.spotifyPlaylist.spotifyUserId,
      playlist.spotifyPlaylist.spotifyPlaylistId,
      limit,
      page,
    );
    const spotifyTracks: PaginatedResultDto<Track> = {
      data:
        tracks?.items
          .flatMap((it) => it.track)
          .map((tr) => this.dtoToEntitySpotifyTrackMapping(tr)) ?? [],
      metadata: {
        total: tracks?.total ?? 0,
        page: page ?? page,
        limit: tracks?.limit ?? limit,
      },
    };
    return spotifyTracks;
  }

  async getPlaylists(userId: string) {
    const playlists = await Playlist.find({ where: { userId: userId } });
    return playlists;
  }

  async createPlaylist(
    userId: string,
    createPlaylistBody: CreateSpotifyPlaylistDto,
    tags: string[],
  ) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('user not found with id ' + userId);
    const spotifyId = user.spotifyUser?.spotifyId;
    createPlaylistBody.description =
      createPlaylistBody.description + ' | TAGS : ' + tags;
    createPlaylistBody.name = createPlaylistBody.name + ' | MUSICTAG';

    if (!spotifyId)
      throw new BadRequestException('no spotify user found for this user');
    const createdPlaylist = await this.spotifyService.createPlaylist(
      spotifyId,
      createPlaylistBody,
    );
    if (!createdPlaylist) {
      throw new Error('no playlist created');
    }
    const playlist = this.dtoToEntitySpotifyPlaylistMapping(createdPlaylist);
    playlist.userId = userId;
    playlist.tags = tags;

    await Playlist.save(playlist);
    return playlist;
  }

  async getPlaylistByTags(userId: string, tags: string[]): Promise<Playlist> {
    const playlistBuilder = await Playlist.createQueryBuilder('playlist')
      .where('playlist.userId = :id', { id: userId })
      .andWhere('tags <@ :tags', { tags: tags })
      .andWhere('array_length(tags,1) = :size', { size: tags.length });

    const res = await playlistBuilder.getOne();
    if (!res) {
      throw new Error('no playlist with tags ' + tags);
    }
    return res;
  }

  async getPlaylistsContainingTags(
    userId: string,
    tags: string[],
  ): Promise<Playlist[]> {
    const playlistBuilder = await Playlist.createQueryBuilder('playlist')
      .where('playlist.userId = :id', { id: userId })
      .andWhere('tags <@ :tags', { tags: tags });
    const res = await playlistBuilder.getMany();
    return res;
  }

  async generatePlaylistItems(
    userId: string,
    tags: string[],
    createPlaylistBody: CreateSpotifyPlaylistDto,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('user not found with id ' + userId);
    const spotifyId = user.spotifyUser?.spotifyId;
    if (!spotifyId) throw new Error('no spotify Id');
    const existingPlaylist = await this.getPlaylistByTags(userId, tags);
    let playlist;
    if (existingPlaylist) {
      throw new BadRequestException(
        'playlist with tags : ' + tags + ' already existing',
      );
    } else {
      playlist = await this.createPlaylist(userId, createPlaylistBody, tags);
    }
    const tracks = await this.taggedtrackService.getTaggedTracks(
      userId,
      0,
      Number.MAX_VALUE,
      tags,
      '',
    );
    let doRequest = true;

    let offset = 0;
    const limit = 100;
    while (doRequest) {
      await this.spotifyService.updateItemsPlaylist(
        spotifyId,
        tracks.data.map((t) => t.track.spotifyTrack.uri),
        playlist.spotifyPlaylist.spotifyPlaylistId,
      );
      offset++;
      doRequest = tracks.data.length > offset * limit;
    }

    return playlist;
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    tags: string[],
    updatePlaylistBody: CreateSpotifyPlaylistDto,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('user not found with id ' + userId);
    if (user && !user.spotifyUser)
      throw new NotFoundException('no spotify user');
    const spotifyId = user.spotifyUser?.spotifyId;
    if (!spotifyId) throw new Error('no spotify Id');

    const playlist = await this.getPlaylistById(userId, playlistId);
    if (!playlist) {
      throw new NotFoundException('playlist not found with id : ' + playlistId);
    }

    const copyTags = [...tags];
    const copyOldTags = [...playlist.tags];
    const isNewTags: boolean =
      copyTags.filter((element) => {
        return !playlist.tags.includes(element);
      }).length > 0 ||
      copyOldTags.filter((element) => {
        return !tags.includes(element);
      }).length > 0;
    if (isNewTags) {
      const existingPlaylist = await this.getPlaylistByTags(userId, tags);
      if (existingPlaylist) {
        throw new BadRequestException(
          'playlist with tags : ' + tags + ' already existing',
        );
      }
    }
    updatePlaylistBody.description =
      updatePlaylistBody.description.split('| TAGS :')[0] + ' | TAGS : ' + tags;
    updatePlaylistBody.name =
      updatePlaylistBody.name.split('| MUSICTAG')[0] + ' | MUSICTAG';

    playlist.description = updatePlaylistBody.description;
    playlist.name = updatePlaylistBody.name;
    playlist.tags = tags;
    await Playlist.save(playlist);

    await this.spotifyService.updateDetailsPlaylist(
      spotifyId,
      updatePlaylistBody,
      playlist.spotifyPlaylist.spotifyPlaylistId,
    );
    if (isNewTags) {
      this.updatePlaylistTracks(userId, playlist, tags);
    }
    return playlist;
  }

  async updatePlaylistTracks(
    userId: string,
    playlist: Playlist,
    tags: string[],
  ) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('user not found with id ' + userId);
    if (user && !user.spotifyUser)
      throw new NotFoundException('no spotify user');
    const spotifyId = user.spotifyUser?.spotifyId;
    if (!spotifyId) throw new Error('no spotify Id');

    const tracks = await this.taggedtrackService.getTaggedTracks(
      userId,
      0,
      Number.MAX_VALUE,
      tags,
      '',
    );
    let doRequest = true;

    let offset = 0;
    const limit = 100;
    while (doRequest) {
      await this.spotifyService.updateItemsPlaylist(
        spotifyId,
        tracks.data.map((t) => t.track.spotifyTrack.uri),
        playlist.spotifyPlaylist.spotifyPlaylistId,
      );
      offset++;
      doRequest = tracks.data.length > offset * limit;
    }
  }

  async deletePlaylist(playlistId: string) {
    await Playlist.delete(playlistId);
  }

  private dtoToEntitySpotifyPlaylistMapping(
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

  private dtoToEntitySpotifyTrackMapping(trackDto: SpotifyTrackDto): Track {
    const track = new Track();
    track.artistName = trackDto.artists[0].name;
    track.albumTitle = trackDto.album.name;
    track.artists = trackDto.artists.map((art) => art.name);
    track.title = trackDto.name;
    track.image = trackDto.album.images[0].url;
    track.duration = trackDto.duration_ms;
    track.spotifyTrack = { spotifyId: trackDto.id, uri: trackDto.uri };
    return track;
  }
}
