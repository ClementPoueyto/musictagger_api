import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Playlist } from 'src/shared/entities/playlist.entity';
import { TaggedTrack } from 'src/shared/entities/tagged-track.entity';
import { PlaylistService } from '../playlist/playlist.service';
import { TrackDto } from '../track/dto/track.dto';
import { TrackService } from '../track/track.service';
import { CreateTaggedTrackDto } from './dto/create-tagged-track.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { TaggedTrackDto } from './dto/tagged-track.dto';
import { TaggedTrackRepository } from './tagged-track.repository';

@Injectable()
export class TaggedTrackService {
  @Inject()
  private readonly trackService: TrackService;

  @Inject(forwardRef(() => PlaylistService))
  private readonly playlistService: PlaylistService;

  @Inject()
  private readonly taggedTrackRepository: TaggedTrackRepository;

  async addTagToTrack(createTag: CreateTaggedTrackDto, userId: string) {
    const track = await this.trackService.getTrackById(createTag.trackId, true);
    track.taggedTracks = [];
    const existingTaggedTrack =
      await this.taggedTrackRepository.getByTrackIdAndUserId(
        createTag.trackId,
        userId,
      );
    const taggedTrack = new TaggedTrack();
    if (existingTaggedTrack) {
      taggedTrack.id = existingTaggedTrack.id;
      taggedTrack.tags = existingTaggedTrack.tags;
    } else {
      taggedTrack.tags = [];
    }
    taggedTrack.tags.includes(createTag.tag)
      ? null
      : taggedTrack.tags.push(createTag.tag);
    taggedTrack.userId = userId;
    taggedTrack.track = track;
    await this.playlistsDelete(userId, taggedTrack.tags);

    await this.taggedTrackRepository.save(taggedTrack);
    await this.playlistsAdd(userId, taggedTrack.tags);

    return taggedTrack;
  }

  async deleteTagToTrack(deleteTag: CreateTaggedTrackDto, userId: string) {
    const track = await this.trackService.getTrackById(deleteTag.trackId);
    const existingTaggedTrack = await this.getTaggedTrackByTrackId(
      deleteTag.trackId,
      userId,
    );
    const taggedTrack = new TaggedTrack();
    if (existingTaggedTrack) {
      taggedTrack.id = existingTaggedTrack.id;
      taggedTrack.tags = existingTaggedTrack.tags;
    } else {
      taggedTrack.tags = [];
    }
    const oldTags = [...taggedTrack.tags];

    taggedTrack.tags = taggedTrack.tags.filter((e) => {
      return e != deleteTag.tag;
    });
    await this.playlistsDelete(userId, oldTags);
    if (taggedTrack.tags.length == 0) {
      await this.taggedTrackRepository.remove(taggedTrack);
    } else {
      taggedTrack.userId = userId;
      taggedTrack.track = track;
      await this.taggedTrackRepository.save(taggedTrack);
    }
    await this.playlistsAdd(userId, oldTags);
  }

  private async playlistsAdd(userId: string, tags: string[]) {
    const playlists: Playlist[] =
      await this.playlistService.getPlaylistsContainingTags(userId, tags);
    for (const playlist of playlists) {
      await this.playlistService.addPlaylistTracks(
        userId,
        playlist,
        playlist.tags,
      );
    }
  }

  private async playlistsDelete(userId: string, tags: string[]) {
    const playlists: Playlist[] =
      await this.playlistService.getPlaylistsContainingTags(userId, tags);
    for (const playlist of playlists) {
      await this.playlistService.clearPlaylist(userId, playlist, playlist.tags);
    }
  }

  async getTaggedTrackByTrackId(
    trackId: string,
    userId: string,
  ): Promise<TaggedTrackDto> {
    const tag = await this.taggedTrackRepository.getByTrackIdAndUserId(
      trackId,
      userId,
      true,
    );
    if (!tag) {
      const track = await this.trackService.getTrackById(trackId);
      return {
        id: '',
        tags: [],
        track: plainToInstance(TrackDto, track, {
          excludeExtraneousValues: true,
        }),
      };
    }
    return plainToInstance(TaggedTrackDto, tag);
  }

  async getAllTagsName(userId: string) {
    const taggedTracks = await this.taggedTrackRepository.getByUserId(userId);
    if (!taggedTracks) {
      return [];
    }
    const allTags = taggedTracks
      .sort((a, b) => (a.id < b.id ? -1 : 1))
      .flatMap((e) => e.tags);
    return Array.from(new Set(allTags));
  }

  async getLikedTaggedTracks(
    userId: string,
    page = 0,
    size = 50,
  ): Promise<PaginatedResultDto<TaggedTrackDto>> {
    const tracksLikePagination: PaginatedResultDto<TrackDto> =
      await this.trackService.getLikedTrack(userId, page, size);
    const resultDto: PaginatedResultDto<TaggedTrackDto> = {
      data: tracksLikePagination.data.map((trackDto) => {
        const taggedTrackDto: TaggedTrackDto = {
          id:
            trackDto?.taggedTracks?.length > 0
              ? trackDto?.taggedTracks[0]?.id
              : '',
          tags:
            trackDto?.taggedTracks?.length > 0
              ? trackDto?.taggedTracks[0]?.tags
              : [],
          track: trackDto,
        };
        taggedTrackDto.track.taggedTracks = [];
        return taggedTrackDto;
      }),
      metadata: tracksLikePagination.metadata,
    };
    return resultDto;
  }

  async getTaggedTracks(
    userId: string,
    page = 0,
    limit = 50,
    tags: Array<string> = [],
    query = '',
    onlyMetadata?: boolean,
  ): Promise<PaginatedResultDto<TaggedTrackDto>> {
    if (!limit) {
      limit = 50;
    }
    if (!page) {
      page = 0;
    }
    if (onlyMetadata) {
      const res =
        await this.taggedTrackRepository.getCountByUserIdAndTagsAndQuery(
          userId,
          tags,
          query,
          page,
          limit,
        );
      const resultDto: PaginatedResultDto<TaggedTrackDto> = {
        data: [],
        metadata: {
          total: res,
          page: page,
          limit: limit,
        },
      };
      return resultDto;
    } else {
      const res =
        await this.taggedTrackRepository.getPaginationByUserIdAndTagsAndQuery(
          userId,
          tags,
          query,
          page,
          limit,
        );
      const resultDto: PaginatedResultDto<TaggedTrackDto> = {
        data: plainToInstance(TaggedTrackDto, res[0], {
          excludeExtraneousValues: true,
        }),
        metadata: {
          total: res[1],
          page: page,
          limit: limit,
        },
      };
      return resultDto;
    }
  }
}
