import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SpotifyAuthService } from '../authentication/spotify-auth/spotify-auth.service';
import { SpotifyPlaylistDetailsDto } from './dto/spotify-playlist-details.dto';
import { SpotifyPaginationPlaylistsDto } from './dto/spotify-pagination-playlists.dto';
import { SpotifyPaginationTracksDto } from './dto/spotify-pagination-tracks.dto';
import { SpotifySeveralTracksDto } from './dto/spotify-several-tracks.dto';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Injectable()
export class SpotifyService {
  private SPOTIFY_URL = 'https://api.spotify.com/v1/';

  @Inject()
  private readonly spotifyAuthService: SpotifyAuthService;

  constructor(private httpService: HttpService) {}
  private getHeaders(accessToken: string) {
    return {
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    };
  }

  async getLikedTracks(spotifyId: string, limit = 50, page = 0) {
    if (!page) page = 0;
    if (!limit || limit > 50) limit = 50;

    const token = await this.spotifyAuthService.getAccessToken(spotifyId);

    const res = await this.httpService.axiosRef
      .get(
        this.SPOTIFY_URL +
          'me/tracks?limit=' +
          limit +
          '&offset=' +
          page * limit,
        { headers: this.getHeaders(token) },
      )
      .catch((e) => {
        console.log(e.message);
        if (e.response.status == HttpStatus.UNAUTHORIZED) {
          console.log(e);
        }
      });
    if (res && res.status == HttpStatus.OK) {
      return plainToInstance(SpotifyPaginationTracksDto, res.data, {
        excludeExtraneousValues: true,
      });
    }
    throw new Error();
  }

  async createPlaylist(spotifyId: string, body: SpotifyPlaylistDetailsDto) {
    const token = await this.spotifyAuthService.getAccessToken(spotifyId);
    const res = await this.httpService.axiosRef
      .post(this.SPOTIFY_URL + 'users/' + spotifyId + '/playlists', body, {
        headers: this.getHeaders(token),
      })
      .catch((e) => {
        if (e.response.status == HttpStatus.UNAUTHORIZED) {
          console.log(e);
        }
      });
    if (res && res.status == HttpStatus.CREATED) {
      return plainToInstance(SpotifyPaginationPlaylistsDto, res.data, {
        excludeExtraneousValues: true,
      });
    }
    throw new Error();
  }

  async addItemsPlaylist(
    spotifyUserId: string,
    tracksURI: string[],
    playlistId: string,
  ) {
    const token = await this.spotifyAuthService.getAccessToken(spotifyUserId);
    const res = await this.httpService.axiosRef
      .post(
        this.SPOTIFY_URL + 'playlists/' + playlistId + '/tracks',
        { uris: tracksURI, position: 0 },
        { headers: this.getHeaders(token) },
      )
      .catch((e) => {
        if (e.response.status == HttpStatus.UNAUTHORIZED) {
          console.log(e);
        }
      });
    if (res && res.status == HttpStatus.CREATED) {
    }
  }

  async updateItemsPlaylist(
    spotifyUserId: string,
    tracksURI: string[],
    playlistId: string,
  ) {
    const token = await this.spotifyAuthService.getAccessToken(spotifyUserId);
    const res = await this.httpService.axiosRef
      .put(
        this.SPOTIFY_URL + 'playlists/' + playlistId + '/tracks',
        { uris: tracksURI },
        { headers: this.getHeaders(token) },
      )
      .catch((e) => {
        console.log(e);
        if (e.response.status == HttpStatus.UNAUTHORIZED) {
          console.log(e);
        }
      });
    if (res && res.status == HttpStatus.CREATED) {
    }
  }

  async updateDetailsPlaylist(
    spotifyUserId: string,
    spotifyPlaylistDetail: SpotifyPlaylistDetailsDto,
    playlistId: string,
  ) {
    const token = await this.spotifyAuthService.getAccessToken(spotifyUserId);
    const res = await this.httpService.axiosRef
      .put(
        this.SPOTIFY_URL + 'playlists/' + playlistId,
        spotifyPlaylistDetail,
        { headers: this.getHeaders(token) },
      )
      .catch((e) => {
        console.log(e);

        if (e.response.status == HttpStatus.UNAUTHORIZED) {
          console.log(e);
        }
      });
    if (res && res.status == HttpStatus.OK) {
    }
  }

  async getPlaylistTracks(
    spotifyUserId: string,
    playlistId: string,
    limit = 50,
    offset = 0,
  ) {
    const token = await this.spotifyAuthService.getAccessToken(spotifyUserId);
    const res = await this.httpService.axiosRef
      .get(
        this.SPOTIFY_URL +
          'playlists/' +
          playlistId +
          '/tracks?limit=' +
          limit +
          '&offset=' +
          offset * limit,
        { headers: this.getHeaders(token) },
      )
      .catch((e) => {
        if (e.response.status == HttpStatus.UNAUTHORIZED) {
          console.log(e);
        }
      });
    if (res && res.status == HttpStatus.OK) {
      return plainToInstance(SpotifyPaginationTracksDto, res.data, {
        excludeExtraneousValues: true,
      });
    }
    throw new Error();
  }

  async getTracksById(ids: string[]): Promise<SpotifySeveralTracksDto> {
    const token = await this.spotifyAuthService.getAppAccessToken();
    console.log(token);
    if (!token) throw ApiInternalServerErrorResponse();
    const res = await this.httpService.axiosRef
      .get(this.SPOTIFY_URL + 'tracks?ids=' + ids.join(','), {
        headers: this.getHeaders(token),
      })
      .catch((e) => {
        if (e.response.status == HttpStatus.UNAUTHORIZED) {
          console.log(e);
        }
      });
    if (res && res.status == HttpStatus.OK) {
      console.log(res.data.tracks[0]);
      return plainToInstance(SpotifySeveralTracksDto, res.data, {
        excludeExtraneousValues: true,
      });
    }
    throw new Error();
  }
}
