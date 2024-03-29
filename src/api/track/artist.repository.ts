import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Artist } from 'src/shared/entities/artist.entity';

@Injectable()
export class ArtistRepository extends Repository<Artist> {
  constructor(private dataSource: DataSource) {
    super(Artist, dataSource.createEntityManager());
  }

  /**
   * Get Artist by @spotifyId and return it
   */
  async getByspotifyArtistId(
    spotifyId: string,
    tracks?: boolean,
  ): Promise<Artist | null> {
    return Artist.findOne({
      where: {
        spotifyArtist: {
          spotifyArtistId: spotifyId,
        },
      },
      relations: { tracks: tracks },
    });
  }
}
