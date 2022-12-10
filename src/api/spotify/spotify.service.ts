import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SpotifyAuthService } from '../authentication/spotify-auth/spotify-auth.service';
import { SpotifyPlaylistDetailsDto } from './dto/spotify-playlist-details.dto';
import { SpotifyPaginationPlaylistsDto } from './dto/spotify-pagination-playlists.dto';
import { SpotifyPaginationTracksDto } from './dto/spotify-pagination-tracks.dto';
import { SpotifySeveralTracksDto } from './dto/spotify-several-tracks.dto';
import { SpotifyArtistDto } from './dto/spotify-artist.dto';
import { SpotifyTrackAnalysisDto } from './dto/spotify-track-analysis.dto';

@Injectable()
export class SpotifyService {
  private SPOTIFY_URL = 'https://api.spotify.com/v1/';

  private MAX_SIZE_ARRAY = 50;

  @Inject()
  private readonly spotifyAuthService: SpotifyAuthService;

  constructor(private httpService: HttpService) {}

  private async getHeaders(spotifyId: string) {
    const accessToken = await this.spotifyAuthService.getAccessToken(spotifyId);
    return {
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    };
  }

  private async getAppHeaders() {
    const token = await this.spotifyAuthService.getAppAccessToken();
    if (!token) throw Error('token app not found');
    return {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    };
  }

  async getLikedTracks(spotifyId: string, limit = 50, page = 0) {
    if (!page) page = 0;
    if (!limit || limit > 50) limit = 50;
    const res = await this.httpService.axiosRef.get(
      this.SPOTIFY_URL + 'me/tracks?limit=' + limit + '&offset=' + page * limit,
      { headers: await this.getHeaders(spotifyId) },
    );
    return plainToInstance(SpotifyPaginationTracksDto, res.data, {
      excludeExtraneousValues: true,
    });
  }

  async createPlaylist(spotifyId: string, body: SpotifyPlaylistDetailsDto) {
    const res = await this.httpService.axiosRef.post(
      this.SPOTIFY_URL + 'users/' + spotifyId + '/playlists',
      body,
      {
        headers: await this.getHeaders(spotifyId),
      },
    );

    return plainToInstance(SpotifyPaginationPlaylistsDto, res.data, {
      excludeExtraneousValues: true,
    });
  }

  async addItemsPlaylist(
    spotifyId: string,
    tracksURI: string[],
    playlistId: string,
  ) {
    await this.httpService.axiosRef.post(
      this.SPOTIFY_URL + 'playlists/' + playlistId + '/tracks',
      { uris: tracksURI, position: 0 },
      { headers: await this.getHeaders(spotifyId) },
    );
  }

  async updateItemsPlaylist(
    spotifyId: string,
    tracksURI: string[],
    playlistId: string,
  ) {
    await this.httpService.axiosRef.put(
      this.SPOTIFY_URL + 'playlists/' + playlistId + '/tracks',
      { uris: tracksURI },
      { headers: await this.getHeaders(spotifyId) },
    );
  }

  async updateDetailsPlaylist(
    spotifyId: string,
    spotifyPlaylistDetail: SpotifyPlaylistDetailsDto,
    playlistId: string,
  ) {
    await this.httpService.axiosRef.put(
      this.SPOTIFY_URL + 'playlists/' + playlistId,
      spotifyPlaylistDetail,
      { headers: await this.getHeaders(spotifyId) },
    );
  }

  async getPlaylistTracks(
    spotifyId: string,
    playlistId: string,
    limit = 50,
    offset = 0,
  ) {
    const res = await this.httpService.axiosRef.get(
      this.SPOTIFY_URL +
        'playlists/' +
        playlistId +
        '/tracks?limit=' +
        limit +
        '&offset=' +
        offset * limit,
      { headers: await this.getHeaders(spotifyId) },
    );

    return plainToInstance(SpotifyPaginationTracksDto, res.data, {
      excludeExtraneousValues: true,
    });
  }

  async getTracksById(ids: string[]): Promise<SpotifySeveralTracksDto> {
    const res = await this.httpService.axiosRef.get(
      this.SPOTIFY_URL + 'tracks?ids=' + ids.join(','),
      {
        headers: await this.getAppHeaders(),
      },
    );

    return plainToInstance(SpotifySeveralTracksDto, res.data, {
      excludeExtraneousValues: true,
    });
  }

  async getArtistsByIds(ids: string[]): Promise<SpotifyArtistDto[]> {
    let index = 0;
    let artists: SpotifyArtistDto[] = [];
    while (index < ids.length) {
      const res = await this.httpService.axiosRef.get(
        this.SPOTIFY_URL +
          'artists?ids=' +
          ids.slice(index, index + this.MAX_SIZE_ARRAY).join(','),
        {
          headers: await this.getAppHeaders(),
        },
      );
      index += res.data.artists.length;
      artists = artists.concat(
        plainToInstance(SpotifyArtistDto, res.data.artists, {
          excludeExtraneousValues: true,
        }),
      );
    }
    return artists;
  }

  async getTrackAnalysisByIds(
    ids: string[],
  ): Promise<SpotifyTrackAnalysisDto[]> {
    let index = 0;
    let analysis: SpotifyTrackAnalysisDto[] = [];
    while (index < ids.length) {
      const res = await this.httpService.axiosRef.get(
        this.SPOTIFY_URL +
          'audio-features?ids=' +
          ids.slice(index, index + this.MAX_SIZE_ARRAY).join(','),
        {
          headers: await this.getAppHeaders(),
        },
      );
      index += res.data.audio_features.length;
      analysis = analysis.concat(
        plainToInstance(SpotifyTrackAnalysisDto, res.data.audio_features, {
          excludeExtraneousValues: true,
        }),
      );
    }
    return analysis;
  }
}
