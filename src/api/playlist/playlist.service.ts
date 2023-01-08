import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { Playlist } from 'src/shared/entities/playlist.entity';
import { Track } from 'src/shared/entities/track.entity';
import { SpotifyUserRequiredException } from 'src/shared/errors/spotify-user-required.error';
import { SpotifyService } from '../spotify/spotify.service';
import { TaggedTrackService } from '../tagged-track/tagged-track.service';
import { UserService } from '../user/user.services';
import { CreateSpotifyPlaylistDto } from './dto/create-spotify-playlist.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { PlaylistRepository } from './playlist.repository';

@Injectable()
export class PlaylistService {
  @Inject()
  private readonly spotifyService: SpotifyService;

  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly playlistRepository: PlaylistRepository;

  @Inject(forwardRef(() => TaggedTrackService))
  private readonly taggedtrackService: TaggedTrackService;

  async getPlaylistById(userId: string, playlistId: string) {
    const playlist = await this.playlistRepository.getById(playlistId);
    if (playlist.userId != userId) throw new UnauthorizedException();
    return playlist;
  }

  async getPlaylistTracks(
    userId: string,
    playlistId: string,
    page = 0,
    limit = 50,
  ) {
    if (!limit) {
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
          .map((tr) => Track.dtoToEntityMapping(tr)) ?? [],
      metadata: {
        total: tracks?.total ?? 0,
        page: page ?? page,
        limit: tracks?.limit ?? limit,
      },
    };
    return spotifyTracks;
  }

  async getPlaylists(userId: string) {
    return await this.playlistRepository.getByUserId(userId);
  }

  async createPlaylist(
    userId: string,
    createPlaylistBody: CreateSpotifyPlaylistDto,
    tags: string[],
    strict: boolean,
  ) {
    const user = await this.userService.findById(userId);
    const spotifyId = user.spotifyUser?.spotifyId;
    createPlaylistBody.description = (
      createPlaylistBody.description +
      ' | TAGS : ' +
      tags
    ).trim();
    createPlaylistBody.name = (createPlaylistBody.name + ' | MUSICTAG').trim();

    if (!spotifyId) throw new SpotifyUserRequiredException();
    const createdPlaylist = await this.spotifyService.createPlaylist(
      spotifyId,
      createPlaylistBody,
    );
    if (!createdPlaylist) {
      throw new Error('no playlist created');
    }
    const playlist = Playlist.dtoToEntityMapping(createdPlaylist);
    playlist.userId = userId;
    playlist.tags = tags;
    playlist.description = createPlaylistBody.description
      .split('| TAGS :')[0]
      .trim();
    playlist.name = createPlaylistBody.name.split('| MUSICTAG')[0].trim();
    playlist.strict = strict;
    await this.playlistRepository.save(playlist);
    return playlist;
  }

  async getPlaylistByTags(userId: string, tags: string[]): Promise<Playlist> {
    return await this.playlistRepository.getPlaylistByTagsAndByUserId(
      userId,
      tags,
    );
  }

  async getStrictsPlaylistsContainingTags(
    userId: string,
    tags: string[],
  ): Promise<Playlist[]> {
    return await this.playlistRepository.getStrictPlaylistsContainingTagsAndByUserId(
      userId,
      tags,
    );
  }

  async getNotStrictsPlaylistsContainingTags(
    userId: string,
    tags: string[],
  ): Promise<Playlist[]> {
    return await this.playlistRepository.getNotStrictPlaylistsContainingTagsAndByUserId(
      userId,
      tags,
    );
  }

  async generatePlaylistItems(
    userId: string,
    tags: string[],
    strict: boolean,
    createPlaylistBody: CreateSpotifyPlaylistDto,
  ) {
    const user = await this.userService.findById(userId);
    const spotifyId = user.spotifyUser?.spotifyId;
    if (!spotifyId) throw new SpotifyUserRequiredException();
    let existingPlaylist;
    let playlist;
    try {
      existingPlaylist = await this.getPlaylistByTags(userId, tags);
    } catch (e) {}
    if (existingPlaylist) {
      throw new BadRequestException(
        'playlist with tags : ' + tags + ' already existing',
      );
    } else {
      playlist = await this.createPlaylist(
        userId,
        createPlaylistBody,
        tags,
        strict,
      );
    }
    const tracks = await this.taggedtrackService.getTaggedTracks(
      userId,
      0,
      Number.MAX_SAFE_INTEGER,
      tags,
      '',
      false,
      strict,
    );

    await this.spotifyService.addItemsPlaylist(
      spotifyId,
      tracks.data.map((t) => t.track.spotifyTrack.uri),
      playlist.spotifyPlaylist.spotifyPlaylistId,
    );

    return playlist;
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    tags: string[],
    strict: boolean,
    updatePlaylistBody: CreateSpotifyPlaylistDto,
  ) {
    const user = await this.userService.findById(userId);
    if (!user.spotifyUser) {
      throw new SpotifyUserRequiredException();
    }
    const spotifyId = user.spotifyUser.spotifyId;
    const playlist = await this.getPlaylistById(userId, playlistId);

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
      let existingPlaylist;
      try {
        existingPlaylist = await this.getPlaylistByTags(userId, tags);
      } catch (e) {}
      if (existingPlaylist) {
        throw new BadRequestException(
          'playlist with tags : ' + tags + ' already existing',
        );
      }
    }
    await this.clearPlaylist(userId, playlist, playlist.tags, strict);

    playlist.description = updatePlaylistBody.description.trim();
    playlist.name = updatePlaylistBody.name.trim();
    playlist.tags = tags;
    playlist.strict = strict;
    await this.playlistRepository.save(playlist);

    updatePlaylistBody.description =
      updatePlaylistBody.description.split('| TAGS :')[0].trim() +
      ' | TAGS : ' +
      tags;
    updatePlaylistBody.name =
      updatePlaylistBody.name.split('| MUSICTAG')[0].trim() + ' | MUSICTAG';

    await this.spotifyService.updateDetailsPlaylist(
      spotifyId,
      updatePlaylistBody,
      playlist.spotifyPlaylist.spotifyPlaylistId,
    );
    if (isNewTags) {
      await this.addPlaylistTracksByTags(userId, playlist, tags, strict);
    }
    return playlist;
  }

  async clearPlaylist(
    userId: string,
    playlist: Playlist,
    tags: string[],
    strict: boolean,
  ) {
    const user = await this.userService.findById(userId);
    if (!user.spotifyUser) throw new SpotifyUserRequiredException();
    const spotifyId = user.spotifyUser?.spotifyId;
    const tracks = await this.taggedtrackService.getTaggedTracks(
      userId,
      0,
      Number.MAX_SAFE_INTEGER,
      tags,
      '',
      false,
      strict,
    );
    return await this.spotifyService.deleteItemsPlaylist(
      spotifyId,
      tracks.data.map((t) => t.track.spotifyTrack.uri),
      playlist.spotifyPlaylist.spotifyPlaylistId,
    );
  }

  async addPlaylistTracksByTags(
    userId: string,
    playlist: Playlist,
    tags: string[],
    strict: boolean,
  ) {
    const user = await this.userService.findById(userId);
    if (!user.spotifyUser) throw new SpotifyUserRequiredException();
    const spotifyId = user.spotifyUser?.spotifyId;
    const tracks = await this.taggedtrackService.getTaggedTracks(
      userId,
      0,
      Number.MAX_SAFE_INTEGER,
      tags,
      '',
      false,
      strict,
    );

    return await this.spotifyService.addItemsPlaylist(
      spotifyId,
      tracks.data.map((t) => t.track.spotifyTrack.uri),
      playlist.spotifyPlaylist.spotifyPlaylistId,
    );
  }

  async addPlaylistTrack(userId: string, playlist: Playlist, track: Track) {
    const user = await this.userService.findById(userId);
    if (!user.spotifyUser) throw new SpotifyUserRequiredException();
    const spotifyId = user.spotifyUser?.spotifyId;
    return await this.spotifyService.addItemsPlaylist(
      spotifyId,
      [track.spotifyTrack.uri],
      playlist.spotifyPlaylist.spotifyPlaylistId,
    );
  }

  async deletePlaylistTrack(userId: string, playlist: Playlist, track: Track) {
    const user = await this.userService.findById(userId);
    if (!user.spotifyUser) throw new SpotifyUserRequiredException();
    const spotifyId = user.spotifyUser?.spotifyId;
    return await this.spotifyService.deleteItemsPlaylist(
      spotifyId,
      [track.spotifyTrack.uri],
      playlist.spotifyPlaylist.spotifyPlaylistId,
    );
  }

  async deletePlaylist(playlistId: string) {
    await this.playlistRepository.delete(playlistId);
  }
}
