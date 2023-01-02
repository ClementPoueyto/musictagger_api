import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SpotifyUser } from 'src/shared/entities/spotify/spotify-user.entity';

@Injectable()
export class SpotifyAuthRepository extends Repository<SpotifyUser> {
  constructor(private dataSource: DataSource) {
    super(SpotifyUser, dataSource.createEntityManager());
  }

  /**
   * Get SpotifyUser by @id and return it
   */
  async getById(id: string, user?: boolean): Promise<SpotifyUser> {
    return SpotifyUser.findOneOrFail({
      where: { spotifyId: id },
      relations: { user: user },
    });
  }
}
