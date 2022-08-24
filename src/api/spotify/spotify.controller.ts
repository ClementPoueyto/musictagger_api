import { BadRequestException, Controller, Get, Inject, Param, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { SpotifyPaginationTracksDto } from './dto/spotify-response-saved-tracks.dto';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
@ApiTags('spotify')
@ApiBearerAuth()
export class SpotifyController {

    @Inject(SpotifyService)
    private readonly spotifyService: SpotifyService;

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({description: 'get Spotify Liked Tracks', type: SpotifyPaginationTracksDto})
  @Get('like')
  async getlikedTracks(    @Req() req: any, @Query('spotifyId') spotifyId : string, @Query('limit') limit = 50, @Query('offset') offset = 0
  ) : Promise<SpotifyPaginationTracksDto>{
    if(!req.user?.spotifyUser?.spotifyId) throw new BadRequestException('No spotify account registered')
    if(!spotifyId) throw new BadRequestException();
    if(spotifyId!=req.user.spotifyUser.spotifyId) throw new UnauthorizedException();
    const res= await this.spotifyService.getLikedTracks(spotifyId, limit, offset);
    return res;
  }
}
