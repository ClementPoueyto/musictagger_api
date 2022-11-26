import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { NotFoundInterceptor } from 'src/shared/interceptors/not-found.interceptor';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { PaginatedResultDto } from '../tagged-track/dto/paginated-result.dto';
import { TrackDto } from './dto/track.dto';
import { TrackService } from './track.service';

@Controller('tracks')
@ApiTags('track')
export class TrackController {
  @Inject()
  private readonly trackService: TrackService;

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'get liked Track by user id',
    type: Promise<PaginatedResultDto<TrackDto>>,
  })
  @Get('like')
  async getLikeTrack(
    @Req() req: any,
    @Query('userId') userId: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<PaginatedResultDto<TrackDto>> {
    if (!userId) throw new BadRequestException('user id missing');
    if (userId != req.user.id) {
      throw new UnauthorizedException();
    }

    return await this.trackService.getLikedTrack(req.user.id, page, size);
  }

  @ApiOkResponse({ description: 'get Track by Id', type: TrackDto })
  @UseInterceptors(NotFoundInterceptor)
  @Get(':id')
  async getTrackById(
    @Param('id', ParseIntPipe) trackId: string,
  ): Promise<TrackDto> {
    if (!trackId) throw new BadRequestException('track id missing');
    return await plainToInstance(
      TrackDto,
      this.trackService.getTrackById(trackId, true),
    );
  }

  @ApiOkResponse({ description: 'get Tracks details', type: Array<TrackDto> })
  @Get('')
  async getTracksDetails(): Promise<TrackDto[]> {
    return await plainToInstance(
      Array<TrackDto>,
      this.trackService.getDetailsTracks(),
    );
  }
}
