import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { TrackDto } from './dto/track.dto';
import { BadRequestException } from '@nestjs/common';
import { PaginatedResultDto } from '../tagged-track/dto/paginated-result.dto';
import { Track } from 'shared/entities/track.entity';
import { SpotifyService } from 'api/spotify/spotify.service';
import { UserService } from 'api/user/user.services';
import { TaggedTrack } from 'shared/entities/tagged-track.entity';
import { SpotifyTrackDto } from 'api/spotify/dto/spotify-track.dto';

@Injectable()
export class TrackService {
  @Inject()
  private readonly spotifyService: SpotifyService;

  @Inject()
  private readonly userService: UserService;

  async getTrackById(id: string, relation: boolean) {
    const track = await Track.findOne({
      relations: { taggedTracks: relation },
      where: { id: id },
    });
    if (!track) throw new NotFoundException('track not found with id : ' + id);
    return track;
  }

  async getLikedTrack(
    userId: string,
    page = 0,
    size = 50,
  ): Promise<PaginatedResultDto<TrackDto>> {
    const user = await this.userService.findById(userId);
    if (!user || !user.spotifyUser?.spotifyId)
      throw new BadRequestException('No spotify account registered');
    const spotifyId = user.spotifyUser.spotifyId;
    const spotifyLikedTracks = await this.spotifyService.getLikedTracks(
      spotifyId,
      size,
      page,
    );
    if (spotifyLikedTracks) {
      const spotifyLikedTracksEntities = spotifyLikedTracks.items.map((item) =>
        this.dtoToEntitySpotifyTrackMapping(item.track),
      );

      for (const trackEntity of spotifyLikedTracksEntities) {
        try {
          const currTrack = await Track.findOne({
            where: {
              artistName: trackEntity.artistName,
              albumTitle: trackEntity.albumTitle,
              title: trackEntity.title,
            },
          });
          if (currTrack) {
            trackEntity.id = currTrack.id;
          }
          await Track.save(trackEntity);
        } catch (err) {}
      }

      const res: any[] = [];

      for (const e of spotifyLikedTracksEntities) {
        await Track.createQueryBuilder('track')
          .leftJoinAndMapOne(
            'track.taggedTrack',
            TaggedTrack,
            'taggedTrack',
            'taggedTrack.trackId = track.id  and taggedTrack.userId = :userId',
            { userId: userId },
          )
          .where(
            'track.title = :title and track.albumTitle = :albumTitle and track.artistName = :artistName',
            {
              title: e.title,
              albumTitle: e.albumTitle,
              artistName: e.artistName,
            },
          )
          .getOne()
          .catch((err) => {
            console.log(err);
          })
          .then((track: any) => {
            if (track && track['taggedTrack']) {
              track.taggedTracks = [];
              track.taggedTracks.push(track['taggedTrack']);
            }
            res.push(track);
          });
      }
      return {
        data: res.map((track) =>
          plainToInstance(TrackDto, track, { excludeExtraneousValues: true }),
        ),
        metadata: {
          page: page,
          total: spotifyLikedTracks.total,
          limit: size,
        },
      };
    }

    return { data: [] };
  }

  async getDetailsTracks() {
    const MAX_SIZE_ARRAY = 50;
    const currentTracks: Track[] = await Track.find();
    const ids = currentTracks.map((t) => t.spotifyTrack.spotifyId);
    const numberRequest = ids.length / MAX_SIZE_ARRAY;
    let spotifyTracks: SpotifyTrackDto[] = [];
    for (let n = 0; n < numberRequest; n++) {
      const currIds = ids.slice(n * MAX_SIZE_ARRAY, (n + 1) * MAX_SIZE_ARRAY);
      const currentSpotifyTracks = await this.spotifyService.getTracksById(
        currIds,
      );

      if (currentSpotifyTracks && currentSpotifyTracks.tracks) {
        spotifyTracks = spotifyTracks.concat(currentSpotifyTracks.tracks);
      }
    }
    spotifyTracks.forEach(async (element) => {
      const t = await Track.findOne({
        where: {
          title: element.name,
          artistName: element.artists[0].name,
          albumTitle: element.album.name,
        },
      });
      if (t) {
        t.popularity = element.popularity;
        t.genres = element.artists[0].genres;
        t.save();
      }
    });
    //console.log(spotifyTracks.map(el=> el.artists[0]))
    return spotifyTracks.map((el) => this.dtoToEntitySpotifyTrackMapping(el));
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
    track.releaseDate = new Date(trackDto.album.release_date);
    track.popularity = trackDto.popularity;
    track.genres = trackDto.artists[0].genres;
    track.duration = trackDto.duration_ms;
    return track;
  }
}
