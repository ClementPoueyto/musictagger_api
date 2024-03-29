import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SpotifyUser } from 'src/shared/entities/spotify/spotify-user.entity';
import { SpotifyUserRequiredException } from 'src/shared/errors/spotify-user-required.error';
import { SpotifyAccessTokenDto } from './dto/spotify-access-token.dto';
import { SpotifyUserDto } from './dto/spotify-user.dto';
import { SpotifyAuthRepository } from './spotify-auth.repository';

@Injectable()
export class SpotifyAuthService {
  private SPOTIFY_ACCOUNT_URL = 'https://accounts.spotify.com/api/';

  @Inject(ConfigService)
  private readonly config: ConfigService;

  @Inject()
  private readonly spotifyUserRepository: SpotifyAuthRepository;

  constructor(private readonly httpService: HttpService) {}

  async findById(id: string) {
    return await this.spotifyUserRepository.getById(id, true);
  }

  async updateSpotifyUser(spotifyUserDto: SpotifyUserDto) {
    const spotifyUser = await this.findById(spotifyUserDto.spotifyId);
    if (!spotifyUser) {
      throw new SpotifyUserRequiredException();
    }
    spotifyUser.spotifyAccessToken = spotifyUserDto.spotifyAccessToken;
    spotifyUser.spotifyRefreshToken = spotifyUserDto.spotifyRefreshToken;
    spotifyUser.tokenCreation = spotifyUserDto.tokenCreation;
    spotifyUser.expiresIn = spotifyUserDto.expiresIn;
    this.spotifyUserRepository.save(spotifyUser);
  }

  async deleteSpotifyUser(user: SpotifyUser) {
    this.spotifyUserRepository.remove(user);
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
    this.spotifyUserRepository.save(spotifyUser);

    return spotifyTokenAccess;
  }

  async getAccessToken(spotifyId: string): Promise<string> {
    const spotifyUser = await this.findById(spotifyId);
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
