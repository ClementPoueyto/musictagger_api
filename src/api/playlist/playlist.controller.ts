import {
  BadRequestException,
  Controller,
  Get,
  Put,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserIdRequiredException } from 'src/shared/errors/user-id-required.error';
import { NotFoundInterceptor } from 'src/shared/interceptors/not-found.interceptor';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { TrackDto } from '../track/dto/track.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { PlaylistDto } from './dto/playlist.dto';
import { PlaylistService } from './playlist.service';

@Controller('playlists')
@ApiBearerAuth()
@ApiTags('playlist')
export class PlaylistController {
  @Inject()
  private readonly playlistService: PlaylistService;

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'get playlist tracks' })
  @UseInterceptors(NotFoundInterceptor)
  @Get(':id/tracks')
  async getPlaylistTracks(
    @Req() req: any,
    @Param('id', ParseIntPipe) playlistId: string,
    @Query('userId') userId: string,
    @Query('size') size = 50,
    @Query('page') page = 0,
  ): Promise<PaginatedResultDto<TrackDto>> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    const playlist = await this.playlistService.getPlaylistTracks(
      userId,
      playlistId,
      page,
      size,
    );
    return {
      data: plainToInstance(TrackDto, playlist.data),
      metadata: playlist.metadata,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'get playlist info' })
  @Get(':id')
  async getPlaylistById(
    @Req() req: any,
    @Param('id', ParseIntPipe) playlistId: string,
    @Query('userId') userId: string,
  ): Promise<PlaylistDto> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    const playlist = await this.playlistService.getPlaylistById(
      userId,
      playlistId,
    );
    return plainToInstance(PlaylistDto, playlist);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'get playlist' })
  @UseInterceptors(NotFoundInterceptor)
  @Get()
  async getPlaylists(
    @Req() req: any,
    @Query('userId') userId: string,
  ): Promise<TrackDto[]> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    const playlist = await this.playlistService.getPlaylists(userId);
    return plainToInstance(TrackDto, playlist);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'create playlist' })
  @UseInterceptors(NotFoundInterceptor)
  @Post()
  async createPlaylist(
    @Req() req: any,
    @Query('userId') userId: string,
  ): Promise<PlaylistDto> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    const playlist = await this.playlistService.generatePlaylistItems(
      userId,
      req.body.tags,
      req.body.strict,
      req.body.playlist,
    );
    return plainToInstance(PlaylistDto, playlist);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'update playlist' })
  @UseInterceptors(NotFoundInterceptor)
  @Put(':id')
  async updatePlaylist(
    @Req() req: any,
    @Query('userId') userId: string,
    @Param('id', ParseIntPipe) playlistId: string,
  ): Promise<PlaylistDto> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    const playlist = await this.playlistService.updatePlaylist(
      userId,
      playlistId,
      req.body.tags,
      req.body.strict,
      req.body.playlist,
    );

    return plainToInstance(PlaylistDto, playlist);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'delete playlist' })
  @UseInterceptors(NotFoundInterceptor)
  @Delete(':id')
  async deletePlaylist(
    @Req() req: any,
    @Query('userId') userId: string,
    @Param('id', ParseIntPipe) playlistId: string,
  ) {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    const playlist = await this.playlistService.deletePlaylist(playlistId);
    return plainToInstance(PlaylistDto, playlist);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'get size playlist' })
  @UseInterceptors(NotFoundInterceptor)
  @Post()
  async getSizePlaylist(
    @Req() req: any,
    @Query('userId') userId: string,
  ): Promise<PlaylistDto> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    const playlist = await this.playlistService.generatePlaylistItems(
      userId,
      req.body.tags,
      req.body.strict,
      req.body.playlist,
    );
    return plainToInstance(PlaylistDto, playlist);
  }
}
