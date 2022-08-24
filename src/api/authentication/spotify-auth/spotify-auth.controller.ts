import { BadRequestException, Controller, Get, Inject, Param, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Profile } from 'passport-spotify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { SpotifyAccessTokenDto } from './dto/spotify-access-token.dto';
import { SpotifyUserDto } from './dto/spotify-user.dto';
import { SpotifyOauthGuard } from './guards/spotify-oauth.guard';
import { SpotifyAuthService } from './spotify-auth.service';

@ApiTags('auth')
@Controller('auth/spotify')
export class SpotifyAuthController {

  @Inject()
  private spotifyAuthService : SpotifyAuthService;

  constructor() {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({description: 'Login on Spotify page and redirect', type : SpotifyAccessTokenDto})
  @Get('token')
  async refresh_access_token(@Request() req: any,@Query('refresh-token') refresh_token: string) : Promise<SpotifyAccessTokenDto> {
    if(!req.user?.spotifyUser?.spotifyId) throw new BadRequestException('No spotify account registered')
    return await this.spotifyAuthService.refresh_access_token(refresh_token, req.user.spotifyUser.spotifyId);
  }

  @UseGuards(SpotifyOauthGuard)
  @ApiOkResponse({description: 'Login on Spotify page and redirect'})
  @Get('login')
  login() : void {
    return;
  }

  @UseGuards(SpotifyOauthGuard)
  @Get('redirect')
  @ApiOkResponse({description: 'Login on Spotify page and redirect', type : SpotifyUserDto})
  async spotifyAuthRedirect(
    @Req() req: any,
  ): Promise<SpotifyUserDto> {
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
    
    const authInfoDto : SpotifyUserDto = {
      spotifyId: user.id,
      spotifyAccessToken: authInfo.accessToken,
      spotifyRefreshToken: authInfo.refreshToken,
      expiresIn: authInfo.expires_in,
      tokenCreation: new Date()
    }

    return authInfoDto;
  }
}