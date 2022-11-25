import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PlaylistService } from 'api/playlist/playlist.service';
import { TrackDto } from 'api/track/dto/track.dto';
import { TrackService } from 'api/track/track.service';
import { plainToInstance } from 'class-transformer';
import { Playlist } from 'shared/entities/playlist.entity';
import { TaggedTrack } from 'shared/entities/tagged-track.entity';
import { CreateTaggedTrackDto } from './dto/create-tagged-track.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { TaggedTrackDto } from './dto/tagged-track.dto';

@Injectable()
export class TaggedTrackService {
  @Inject(TrackService)
  private readonly trackService: TrackService;

  @Inject(forwardRef(() => PlaylistService))
  private readonly playlistService: PlaylistService;

  async addTagToTrack(createTag: CreateTaggedTrackDto, userId: string) {
    const track = await this.trackService.getTrackById(createTag.trackId, true);
    track.taggedTracks = [];
    const existingTaggedTrack = await TaggedTrack.findOne({
      where: { track: { id: createTag.trackId }, userId: userId },
    });
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

    await TaggedTrack.save(taggedTrack);

    this.playlistsChangement(userId, taggedTrack.tags);
    return taggedTrack;
  }

  async deleteTagToTrack(deleteTag: CreateTaggedTrackDto, userId: string) {
    const track = await this.trackService.getTrackById(
      deleteTag.trackId,
      false,
    );
    const existingTaggedTrack = await TaggedTrack.findOne({
      where: { track: { id: deleteTag.trackId }, userId: userId },
    });
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
    if (taggedTrack.tags.length == 0) {
      await TaggedTrack.remove(taggedTrack);
    } else {
      taggedTrack.userId = userId;
      taggedTrack.track = track;
      await TaggedTrack.save(taggedTrack);
    }
    this.playlistsChangement(userId, oldTags);
  }

  private async playlistsChangement(userId: string, tags: string[]) {
    const playlists: Playlist[] =
      await this.playlistService.getPlaylistsContainingTags(userId, tags);
    for (const playlist of playlists) {
      this.playlistService.updatePlaylistTracks(
        userId,
        playlist,
        playlist.tags,
      );
    }
  }

  async getTaggedTrackByTrackId(
    trackId: string,
    userId: string,
  ): Promise<TaggedTrackDto> {
    const tag = await TaggedTrack.findOne({
      relations: { track: true },
      where: { track: { id: trackId }, userId: userId },
    });
    if (!tag) {
      const track = await this.trackService.getTrackById(trackId, false);
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
    const taggedTracks = await TaggedTrack.find({ where: { userId: userId } });
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
    if (!limit || limit > 50) {
      limit = 50;
    }
    if (!page) {
      page = 0;
    }
    const taggedTracksBuilder = await TaggedTrack.createQueryBuilder(
      'taggedtrack',
    )
      .innerJoinAndSelect('taggedtrack.track', 'track')
      .where('taggedtrack.userId = :id', { id: userId });
    taggedTracksBuilder.andWhere('tags @> :filters', { filters: tags });
    taggedTracksBuilder.andWhere(
      '(LOWER(track.title) LIKE LOWER(:query) OR LOWER(track.artistName) LIKE LOWER(:query) OR LOWER(track.albumTitle) LIKE LOWER(:query))',
      {
        query: '%' + query + '%',
      },
    );
    taggedTracksBuilder
      .orderBy('taggedtrack.id', 'DESC')
      .limit(limit || 50)
      .offset(page * limit || 0);
    if (onlyMetadata) {
      const res = await taggedTracksBuilder.getCount();
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
      const res = await taggedTracksBuilder.getManyAndCount();
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
