import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Track } from 'src/shared/entities/track.entity';

@Injectable()
export class TrackRepository extends Repository<Track> {
  constructor(private dataSource: DataSource) {
    super(Track, dataSource.createEntityManager());
  }

  /**
   * Get Track by @id and return it
   */
  async getById(
    id: string,
    taggedTracks?: boolean,
    artists?: boolean,
  ): Promise<Track> {
    return Track.findOneOrFail({
      relations: {
        taggedTracks: taggedTracks,
        artists: artists,
      },
      where: { id: id },
    });
  }

  /**
   * Get Track by @title and @artistName and @albumTitle and return it
   */
  async getByTitleAndArtistNameAndAlbumTitle(
    title: string,
    artistName: string,
    albumTitle: string,
  ): Promise<Track | null> {
    return Track.findOne({
      where: {
        artistName: artistName,
        albumTitle: albumTitle,
        title: title,
      },
    });
  }

  /**
   * Get Track by @title and @artistName and @albumTitle and return it with TaggedTrack by @userId
   */
  async getTrackByTaggedTrackUserIdAndByTitleAndArtistNameAndAlbumTitle(
    userId: string,
    title: string,
    albumTitle: string,
    artistName: string,
  ): Promise<Track | null> {
    return Track.findOne({
      where: {
        title: title,
        albumTitle: albumTitle,
        artistName: artistName,
        taggedTracks: {
          userId: userId,
        },
      },
    });
  }

  /**
   * Get Track by @spotifyId and return it
   */
  async getBySpotifyId(
    spotifyId: string,
    artists?: boolean,
    taggedTracks?: boolean,
  ): Promise<Track | null> {
    return Track.findOne({
      where: { spotifyTrack: { spotifyId: spotifyId } },
      relations: { artists: artists, taggedTracks: taggedTracks },
    });
  }

  /**
   * Get Tracks by @Ids and return them
   */
  async getByIds(
    trackIds: string[],
    artists?: boolean,
    taggedTracks?: boolean,
  ): Promise<Track[]> {
    return Track.find({
      where: { id: In(trackIds) },
      relations: { taggedTracks: taggedTracks, artists: artists },
    });
  }

  /**
   * Get all Tracks and return them
   */
  async getAll(artists?: boolean, taggedTracks?: boolean) {
    return Track.find({
      relations: { taggedTracks: taggedTracks, artists: artists },
    });
  }
}
