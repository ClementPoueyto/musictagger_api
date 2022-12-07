import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { TrackDto } from './dto/track.dto';
import { BadRequestException } from '@nestjs/common';
import { PaginatedResultDto } from '../tagged-track/dto/paginated-result.dto';
import { SpotifyService } from '../spotify/spotify.service';
import { UserService } from '../user/user.services';
import { Track } from 'src/shared/entities/track.entity';
import { TaggedTrack } from 'src/shared/entities/tagged-track.entity';
import { SpotifyTrackDto } from '../spotify/dto/spotify-track.dto';
import { SpotifyUserRequiredException } from 'src/shared/errors/spotify-user-required.error';
import { SpotifyArtistDto } from '../spotify/dto/spotify-artist.dto';
import { Artist } from 'src/shared/entities/artist.entity';
import { SpotifyArtist } from 'src/shared/entities/spotify/spotify-artist.entity';
import { In } from 'typeorm';

@Injectable()
export class TrackService {
  @Inject()
  private readonly spotifyService: SpotifyService;

  @Inject()
  private readonly userService: UserService;

  async getTrackById(id: string, taggedtracks: boolean, artists: boolean) {
    const track = await Track.findOneOrFail({
      relations: { taggedTracks: taggedtracks, artists: artists },
      where: { id: id },
    });
    return track;
  }

  async getLikedTrack(
    userId: string,
    page = 0,
    size = 50,
  ): Promise<PaginatedResultDto<TrackDto>> {
    const user = await this.userService.findById(userId);
    if (!user || !user.spotifyUser?.spotifyId)
      throw new SpotifyUserRequiredException();
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
          await this.saveTrack(trackEntity);
        } catch (err) {
          console.log(err);
        }
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
          .catch((err: any) => {
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

  updateDetailsTracks(trackIds?: string[]): Promise<void> {
    let request: Promise<Track[]>;
    if (trackIds && trackIds.length > 0) {
      request = Track.find({
        where: { id: In(trackIds) },
        relations: { taggedTracks: false, artists: true },
      });
    } else {
      request = Track.find({
        relations: { taggedTracks: false, artists: true },
      });
    }
    return request.then((tracks) => {
      const artistIds = new Set(
        tracks
          .flatMap((t) => t.artists)
          .filter((f) => f != null)
          .map((a) => a.spotifyArtist.spotifyArtistId),
      );
      return this.spotifyService
        .getArtistsByIds(Array.from(artistIds.values()))
        .then((spotifyArtists) => {
          const artists = spotifyArtists
            .map((a) => this.dtoToEntitySpotifyArtistMapping(a))
            .filter((a) => a != null && a.spotifyArtist != null);

          artists.forEach((artist) => {
            return Artist.findOne({
              where: {
                spotifyArtist: {
                  spotifyArtistId: artist.spotifyArtist.spotifyArtistId,
                },
              },
              relations: { tracks: true },
            }).then((art) => {
              if (art) {
                art.genres = artist.genres;
                art.popularity = artist.popularity;
                for (const track of art.tracks) {
                  this.getTrackById(track.id, false, false).then((track) => {
                    if (art.genres) {
                      track.genres = art.genres;
                    }
                    Track.update(track.id, track);
                  });
                }
                return Artist.save(art);
              }
            });
          });
        });
    });
  }

  getTrackArtistsById(spotifyArtistIds: string[]): Promise<Artist[]> {
    return this.spotifyService
      .getArtistsByIds(spotifyArtistIds)
      .then((artistsSpotify: SpotifyArtistDto[]) => {
        const artists = artistsSpotify.map((a) =>
          this.dtoToEntitySpotifyArtistMapping(a),
        );
        return Artist.create(artists);
      });
  }

  private async saveTrack(track: Track) {
    const artists: Artist[] = [];
    for (const artist of track.artists) {
      const existingArtist = await Artist.findOne({
        where: {
          spotifyArtist: {
            spotifyArtistId: artist.spotifyArtist.spotifyArtistId,
          },
        },
      });
      if (!existingArtist) {
        const newArtist = await Artist.save(artist);
        artists.push(newArtist);
      } else {
        artists.push(existingArtist);
      }
    }
    track.artists = artists;
    return await Track.save(track);
  }

  private dtoToEntitySpotifyTrackMapping(trackDto: SpotifyTrackDto): Track {
    const track = new Track();
    track.artists = trackDto.artists.map((a) =>
      this.dtoToEntitySpotifyArtistMapping(a),
    );
    track.artistName = trackDto.artists[0].name;
    track.albumTitle = trackDto.album.name;
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

  private dtoToEntitySpotifyArtistMapping(artistDto: SpotifyArtistDto): Artist {
    const artist = new Artist();
    const spotifyArtist = new SpotifyArtist();
    artist.name = artistDto.name;
    artist.genres = artistDto.genres;
    artist.popularity = artistDto.popularity;
    artist.type = artistDto.type;
    spotifyArtist.spotifyArtistId = artistDto.id;
    spotifyArtist.spotifyUri = artistDto.uri;
    artist.spotifyArtist = spotifyArtist;
    return artist;
  }
}
