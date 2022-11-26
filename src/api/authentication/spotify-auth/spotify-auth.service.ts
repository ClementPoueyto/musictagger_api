import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SpotifyUser } from 'src/shared/entities/spotify-user.entity';
import { SpotifyAccessTokenDto } from './dto/spotify-access-token.dto';
import { SpotifyUserDto } from './dto/spotify-user.dto';

@Injectable()
export class SpotifyAuthService {
  private SPOTIFY_ACCOUNT_URL = 'https://accounts.spotify.com/api/';

  @Inject(ConfigService)
  private readonly config: ConfigService;

  constructor(private readonly httpService: HttpService) {}

  async findById(id: string) {
    return await SpotifyUser.findOneOrFail({
      where: { spotifyId: id },
      relations: { user: true },
    });
  }

  async updateSpotifyUser(spotifyUserDto: SpotifyUserDto) {
    const spotifyUser = await this.findById(spotifyUserDto.spotifyId);
    if (!spotifyUser) {
      throw new Error('no spotify user');
    }
    spotifyUser.spotifyAccessToken = spotifyUserDto.spotifyAccessToken;
    spotifyUser.spotifyRefreshToken = spotifyUserDto.spotifyRefreshToken;
    spotifyUser.tokenCreation = spotifyUserDto.tokenCreation;
    spotifyUser.expiresIn = spotifyUserDto.expiresIn;
    SpotifyUser.save(spotifyUser);
  }

  async deleteSpotifyUser(user: SpotifyUser) {
    SpotifyUser.remove(user);
  }

  async refresh_access_token(
    refresh_token: string,
    spotifyId: string,
  ): Promise<SpotifyAccessTokenDto> {
    const header = {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          this.config.get<string>('SPOTIFY_CLIENT_ID') +
            ':' +
            this.config.get<string>('SPOTIFY_CLIENT_SECRET'),
        ).toString('base64'),
    };
    const result = (
      await this.httpService.axiosRef.post(
        this.SPOTIFY_ACCOUNT_URL + 'token',
        `grant_type=refresh_token&refresh_token=${refresh_token}`,
        { headers: header },
      )
    ).data;
    if (!result) throw new BadRequestException();
    const spotifyTokenAccess = new SpotifyAccessTokenDto(result);
    const spotifyUser = await this.findById(spotifyId);
    spotifyUser.spotifyAccessToken = spotifyTokenAccess.access_token;
    spotifyUser.tokenCreation = new Date();
    spotifyUser.expiresIn = spotifyTokenAccess.expires_in;
    SpotifyUser.save(spotifyUser);

    return spotifyTokenAccess;
  }

  async getAccessToken(spotifyId: string): Promise<string> {
    const spotifyUser = await this.findById(spotifyId);
    if (!spotifyUser.spotifyAccessToken)
      throw new BadRequestException('no spotify access token');
    const tokenDate = spotifyUser.tokenCreation;
    tokenDate.setSeconds(
      spotifyUser.tokenCreation.getSeconds() + spotifyUser.expiresIn,
    );
    if (tokenDate.getTime() <= new Date().getTime()) {
      const token = await this.refresh_access_token(
        spotifyUser.spotifyRefreshToken,
        spotifyUser.spotifyId,
      );
      return token.access_token;
    }

    return spotifyUser.spotifyAccessToken;
  }

  async getAppAccessToken(): Promise<string> {
    const header = {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          this.config.get<string>('SPOTIFY_CLIENT_ID') +
            ':' +
            this.config.get<string>('SPOTIFY_CLIENT_SECRET'),
        ).toString('base64'),
    };

    const result = (
      await this.httpService.axiosRef.post(
        this.SPOTIFY_ACCOUNT_URL + 'token',
        `grant_type=client_credentials`,
        { headers: header },
      )
    ).data;
    return result.access_token;
  }
}
