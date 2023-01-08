import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Playlist } from 'src/shared/entities/playlist.entity';
import { TaggedTrack } from 'src/shared/entities/tagged-track.entity';

@Injectable()
export class TaggedTrackRepository extends Repository<TaggedTrack> {
  constructor(private dataSource: DataSource) {
    super(TaggedTrack, dataSource.createEntityManager());
  }

  /**
   * Get TaggedTrack by @id and return it
   */
  async getById(id: string): Promise<Playlist> {
    return Playlist.findOneOrFail({
      where: { id: id },
    });
  }

  /**
   * Get TaggedTrack by @trackId and @userId
   */
  async getByTrackIdAndUserId(
    trackId: string,
    userId: string,
    track?: boolean,
  ): Promise<TaggedTrack | null> {
    return TaggedTrack.findOne({
      relations: { track: track },
      where: { track: { id: trackId }, userId: userId },
    });
  }

  /**
   * Get TaggedTrack by @userId
   */
  async getByUserId(userId: string): Promise<TaggedTrack[]> {
    return TaggedTrack.find({ where: { userId: userId } });
  }

  /**
   * Get TaggedTrack by @userId and @tags and @query
   */
  private getByUserIdAndTagsAndQuery(
    userId: string,
    filters: Array<string> = [],
    query = '',
    page = 0,
    limit = 50,
    isStrict = true,
  ): SelectQueryBuilder<TaggedTrack> {
    const operand = isStrict ? '@>' : '&&';
    return TaggedTrack.createQueryBuilder('taggedtrack')
      .innerJoinAndSelect('taggedtrack.track', 'track')
      .where('taggedtrack.userId = :id', { id: userId })
      .andWhere('tags ' + operand + ' :filters', { filters: filters })
      .andWhere(
        '(LOWER(track.title) LIKE LOWER(:query) OR LOWER(track.artistName) LIKE LOWER(:query) OR LOWER(track.albumTitle) LIKE LOWER(:query))',
        {
          query: '%' + query + '%',
        },
      )
      .orderBy('taggedtrack.id', 'DESC')
      .limit(limit ? limit : 50)
      .offset(page * limit ? page * limit : 0);
  }

  /**
   * Get count TaggedTrack by @userId and @tags and @query
   */
  async getCountByUserIdAndTagsAndQuery(
    userId: string,
    tags: Array<string> = [],
    query = '',
    page = 0,
    limit = 50,
    isStrict = true,
  ): Promise<number> {
    return this.getByUserIdAndTagsAndQuery(
      userId,
      tags,
      query,
      page,
      limit,
      isStrict,
    ).getCount();
  }

  /**
   * Get pagination TaggedTrack by @userId and @tags and @query
   */
  async getPaginationByUserIdAndTagsAndQuery(
    userId: string,
    tags: Array<string> = [],
    query = '',
    page = 0,
    limit = 50,
    isStrict = true,
  ): Promise<[TaggedTrack[], number]> {
    return this.getByUserIdAndTagsAndQuery(
      userId,
      tags,
      query,
      page,
      limit,
      isStrict,
    ).getManyAndCount();
  }
}
