import { BadRequestException, Controller, Get, Put, Inject, Param, ParseArrayPipe, ParseIntPipe, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { TrackDto } from '../track/dto/track.dto';
import { PlaylistDto } from './dto/playlist.dto';
import { PlaylistService } from './playlist.service';

@Controller('playlists')
@ApiBearerAuth()
@ApiTags('playlist')
export class PlaylistController {

    @Inject()
    private readonly playlistService : PlaylistService;

    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({description: 'get playlist tracks' })
    @Get(':id')
    async getPlaylistTracks(@Req() req: any, @Param('id', ParseIntPipe) playlistId : string ,@Query('userId') userId : string
    ) : Promise<TrackDto[]> {
      if(!userId) throw new BadRequestException('userId missing');
      if(userId!=req.user.id) throw new UnauthorizedException();
      const playlist =await this.playlistService.getPlaylistTracks(userId, playlistId);
      return  plainToInstance(TrackDto, playlist);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({description: 'get playlist' })
    @Get()
    async getPlaylists(@Req() req: any,@Query('userId') userId : string
    ) : Promise<TrackDto[]> {
      if(!userId) throw new BadRequestException('userId missing');
      if(userId!=req.user.id) throw new UnauthorizedException();
      const playlist =await this.playlistService.getPlaylists(userId);
      return  plainToInstance(TrackDto, playlist);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({description: 'create playlist' })
    @Post()
    async createPlaylist(@Req() req: any,@Query('userId') userId : string
    ) : Promise<PlaylistDto> {
      if(!userId) throw new BadRequestException('userId missing');
      if(userId!=req.user.id) throw new UnauthorizedException();
      const playlist =await this.playlistService.generatePlaylistItems(userId, req.body.tags, req.body.playlist);
      return  plainToInstance(PlaylistDto, playlist);
    }
    


}
