import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Playlist } from 'src/shared/entities/playlist.entity';

@Injectable()
export class PlaylistRepository extends Repository<Playlist> {
  constructor(private dataSource: DataSource) {
    super(Playlist, dataSource.createEntityManager());
  }

  /**
   * Get Playlist by @id and return it
   */
  async getById(id: string): Promise<Playlist> {
    return Playlist.findOneOrFail({
      where: { id: id },
    });
  }

  /**
   * Get all Playlists by @userId and return them
   */
  async getByUserId(userId: string): Promise<Playlist[]> {
    return Playlist.find({ where: { userId: userId } });
  }

  /**
   * Get playlist by @tags for a user with @userId
   */
  async getPlaylistByTagsAndByUserId(
    userId: string,
    tags: string[],
  ): Promise<Playlist> {
    return Playlist.createQueryBuilder('playlist')
      .where('playlist.userId = :id', { id: userId })
      .andWhere('tags <@ :tags', { tags: tags })
      .andWhere('array_length(tags,1) = :size', { size: tags.length })
      .getOneOrFail();
  }

  /**
   * Get all stricts playlists containing at least @tags for a user with @userId
   */
  async getStrictPlaylistsContainingTagsAndByUserId(
    userId: string,
    tags: string[],
  ): Promise<Playlist[]> {
    return Playlist.createQueryBuilder('playlist')
      .where('playlist.userId = :id', { id: userId })
      .andWhere('strict = true and tags <@ :tags', { tags: tags })
      .getMany();
  }

  /**
   * Get all not stricts playlists containing at least @tags for a user with @userId
   */
  async getNotStrictPlaylistsContainingTagsAndByUserId(
    userId: string,
    tags: string[],
  ): Promise<Playlist[]> {
    return Playlist.createQueryBuilder('playlist')
      .where('playlist.userId = :id', { id: userId })
      .andWhere('strict = false and tags && :tags', { tags: tags })
      .getMany();
  }
}
