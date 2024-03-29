import {
  Controller,
  Get,
  Inject,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Profile } from 'passport-spotify';
import { SpotifyUserRequiredException } from 'src/shared/errors/spotify-user-required.error';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { SpotifyAccessTokenDto } from './dto/spotify-access-token.dto';
import { SpotifyUserDto } from './dto/spotify-user.dto';
import { SpotifyOauthGuard } from './guards/spotify-oauth.guard';
import { SpotifyAuthService } from './spotify-auth.service';

@ApiTags('auth')
@Controller('auth/spotify')
export class SpotifyAuthController {
  @Inject()
  private spotifyAuthService: SpotifyAuthService;
  @Inject(ConfigService) config: ConfigService;

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Login on Spotify page and redirect',
    type: SpotifyAccessTokenDto,
  })
  @Get('token')
  async refresh_access_token(
    @Request() req: any,
    @Query('refresh-token') refresh_token: string,
  ): Promise<SpotifyAccessTokenDto> {
    if (!req.user?.spotifyUser?.spotifyId)
      throw new SpotifyUserRequiredException();
    return await this.spotifyAuthService.refresh_access_token(
      refresh_token,
      req.user.spotifyUser.spotifyId,
    );
  }

  @UseGuards(SpotifyOauthGuard)
  @ApiOkResponse({ description: 'Login on Spotify page and redirect' })
  @Get('login')
  login(): void {
    return;
  }

  @UseGuards(SpotifyOauthGuard)
  @Get('redirect')
  @ApiOkResponse({
    description: 'Login on Spotify page and redirect',
    type: SpotifyUserDto,
  })
  async spotifyAuthRedirect(
    @Req() req: any,
    @Res() res: any,
  ): Promise<SpotifyUserDto> {
    try {
      const {
        user,
        authInfo,
      }: {
        user: Profile;
        authInfo: {
          accessToken: string;
          refreshToken: string;
          expires_in: number;
        };
      } = req;
      const authInfoDto: SpotifyUserDto = {
        spotifyId: user.id,

        spotifyAccessToken: authInfo.accessToken,
        spotifyRefreshToken: authInfo.refreshToken,
        expiresIn: authInfo.expires_in,
        tokenCreation: new Date(),
      };
      res.redirect(
        this.config.get('SPOTIFY_REDIRECT_URL_FRONTEND') +
          'success?spotifyId=' +
          authInfoDto.spotifyId +
          '&spotifyAccessToken=' +
          authInfoDto.spotifyAccessToken +
          '&spotifyRefreshToken=' +
          authInfoDto.spotifyRefreshToken +
          '&expiresIn=' +
          authInfoDto.expiresIn +
          '&tokenCreation=' +
          authInfoDto.tokenCreation,
      );
      return authInfoDto;
    } catch (err) {
      console.log(err);
      res.redirect(
        this.config.get('SPOTIFY_REDIRECT_URL_FRONTEND') + 'failure',
      );
      return req.authInfo;
    }
  }
}
