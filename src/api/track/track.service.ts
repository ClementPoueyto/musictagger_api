import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { TrackDto } from './dto/track.dto';
import { PaginatedResultDto } from '../tagged-track/dto/paginated-result.dto';
import { SpotifyService } from '../spotify/spotify.service';
import { UserService } from '../user/user.services';
import { Track } from 'src/shared/entities/track.entity';
import { SpotifyUserRequiredException } from 'src/shared/errors/spotify-user-required.error';
import { SpotifyArtistDto } from '../spotify/dto/spotify-artist.dto';
import { Artist } from 'src/shared/entities/artist.entity';
import { SpotifyTrackAnalysis } from 'src/shared/entities/spotify/spotify-track-analysis.entity';
import { TrackRepository } from './track.repository';
import { ArtistRepository } from './artist.repository';

@Injectable()
export class TrackService {
  @Inject()
  private readonly spotifyService: SpotifyService;

  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly trackRepository: TrackRepository;

  @Inject()
  private readonly artistRepository: ArtistRepository;

  async getTrackById(id: string, taggedtracks?: boolean, artists?: boolean) {
    return await this.trackRepository.getById(id, taggedtracks, artists);
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
        Track.dtoToEntityMapping(item.track),
      );
      const newTracks: Track[] = [];
      for (const trackEntity of spotifyLikedTracksEntities) {
        try {
          const currTrack =
            await this.trackRepository.getByTitleAndArtistNameAndAlbumTitle(
              trackEntity.title,
              trackEntity.artistName,
              trackEntity.albumTitle,
            );
          if (currTrack) {
            trackEntity.id = currTrack.id;
          } else {
            const newTrack = await this.saveTrack(trackEntity);
            trackEntity.id = newTrack.id;
            newTracks.push(trackEntity);
          }
        } catch (err) {
          console.log(err);
        }
      }
      if (newTracks.length > 0) {
        this.updateDetailsTracks(newTracks.map((t) => t.id));
      }
      const res: any[] = [];

      for (const e of spotifyLikedTracksEntities) {
        await this.trackRepository
          .getTrackByTaggedTrackUserIdAndByTitleAndArtistNameAndAlbumTitle(
            userId,
            e.title,
            e.albumTitle,
            e.artistName,
          )
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
      request = this.trackRepository.getByIds(trackIds, true, false);
    } else {
      request = this.trackRepository.getAll(true, false);
    }

    return request.then((tracks) => {
      const artistIds = new Set(
        tracks
          .flatMap((t) => t.artists)
          .filter((f) => f != null)
          .map((a) => a.spotifyArtist.spotifyArtistId),
      );
      return Promise.all([
        this.spotifyService.getArtistsByIds(Array.from(artistIds.values())),
        this.spotifyService.getTrackAnalysisByIds(
          tracks.map((t) => t.spotifyTrack.spotifyId),
        ),
      ]).then(async (result) => {
        const artists = result[0].map((a) => Artist.dtoToEntityMapping(a));
        for (const artist of artists) {
          const artistsEntity =
            await this.artistRepository.getByspotifyArtistId(
              artist.spotifyArtist.spotifyArtistId,
              true,
            );
          if (artistsEntity) {
            artistsEntity.genres = artist.genres;
            artistsEntity.popularity = artist.popularity;
            await this.artistRepository.save(artistsEntity);
          }
        }

        for (const analyse of result[1]) {
          const track = await this.trackRepository.getBySpotifyId(
            analyse.id,
            true,
            false,
          );
          if (track) {
            track.analysis =
              SpotifyTrackAnalysis.dtoToEntitySpotifyTrackAnalysisMapping(
                analyse,
              );
            let genres: string[] = [];
            for (const trackArtist of track.artists) {
              if (trackArtist.genres && trackArtist.genres.length > 0) {
                genres = genres.concat(trackArtist.genres);
              }
            }
            track.genres = [...new Set(genres)];
            await this.trackRepository.save(track);
          }
        }
      });
    });
  }

  getTrackArtistsById(spotifyArtistIds: string[]): Promise<Artist[]> {
    return this.spotifyService
      .getArtistsByIds(spotifyArtistIds)
      .then((artistsSpotify: SpotifyArtistDto[]) => {
        const artists = artistsSpotify.map((a) => Artist.dtoToEntityMapping(a));
        return this.artistRepository.create(artists);
      });
  }

  private async saveTrack(track: Track) {
    const artists: Artist[] = [];
    for (const artist of track.artists) {
      const existingArtist = await this.artistRepository.getByspotifyArtistId(
        artist.spotifyArtist.spotifyArtistId,
      );
      if (!existingArtist) {
        const newArtist = await this.artistRepository.save(artist);
        artists.push(newArtist);
      } else {
        artists.push(existingArtist);
      }
    }
    track.artists = artists;
    return await this.trackRepository.save(track);
  }

  async getSuggestionsTags(trackId: string): Promise<string[]> {
    let suggestions: string[] = [];
    const track = await this.getTrackById(trackId, true, true);
    suggestions = suggestions.concat(track.genres);

    if (
      track.artists.map((a) => a.popularity).filter((v) => Number(v) >= 70)
        .length > 0
    ) {
      suggestions.push('popular artist');
    }

    if (
      track.artists.map((a) => a.popularity).filter((v) => Number(v) <= 50)
        .length > 0
    ) {
      suggestions.push('unknown artist');
    }
    if (track.analysis) {
      if (track.analysis.energy && track.analysis.energy >= 0.8) {
        suggestions.push('energetic');
      }
      if (track.analysis.energy && track.analysis.energy <= 0.5) {
        suggestions.push('chill');
      }
      if (track.analysis.tempo && track.analysis.tempo >= 130) {
        suggestions.push('high bpm');
      }
      if (track.analysis.tempo && track.analysis.tempo <= 90) {
        suggestions.push('slow bpm');
      }
      if (
        track.analysis.tempo &&
        track.analysis.energy &&
        track.analysis.tempo >= 130 &&
        track.analysis.energy >= 0.8
      ) {
        suggestions.push('sport');
      }
      if (track.analysis.valence && track.analysis.valence >= 0.8) {
        suggestions.push('happy');
      }
      if (track.analysis.valence && track.analysis.valence <= 0.4) {
        suggestions.push('sad');
      }
      if (
        track.analysis.instrumentalness &&
        track.analysis.instrumentalness >= 0.6
      ) {
        suggestions.push('instrumental');
      }
      if (
        track.analysis.danceability &&
        (track.analysis.danceability >= 0.85 ||
          (track.analysis.energy &&
            track.analysis.danceability > 0.7 &&
            track.analysis.energy > 0.8))
      ) {
        suggestions.push('dance');
      }
      if (track.popularity && track.popularity > 0.75) {
        suggestions.push('Hit');
      }
      const yearDiff = Math.abs(
        new Date(
          track.releaseDate.getTime() - new Date().getTime(),
        ).getFullYear() - 1970,
      );
      if (yearDiff < 2) {
        suggestions.push('recent');
      }
    }
    suggestions.push(track.releaseDate.getFullYear().toString());
    suggestions.push(
      (Math.round(track.releaseDate.getFullYear() / 10) * 10).toString() + "'s",
    );

    return suggestions;
  }
}
