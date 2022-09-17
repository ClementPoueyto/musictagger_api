import { BadRequestException, Controller, Get, Inject, Param, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { SpotifyPaginationTracksDto } from './dto/spotify-pagination-tracks.dto';
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
  async getlikedTracks(@Query('spotifyId') spotifyId : string, @Query('limit') limit = 50, @Query('offset') offset = 0
  ) : Promise<SpotifyPaginationTracksDto>{
    if(!spotifyId) throw new BadRequestException();
    const res= await this.spotifyService.getLikedTracks(spotifyId, limit, offset);
    return res;
  }
}
