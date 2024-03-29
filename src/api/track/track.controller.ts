import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserIdRequiredException } from 'src/shared/errors/user-id-required.error';
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
  @UseInterceptors(NotFoundInterceptor)
  @Get('like')
  async getLikeTrack(
    @Req() req: any,
    @Query('userId') userId: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<PaginatedResultDto<TrackDto>> {
    if (!userId) throw new UserIdRequiredException();
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
      this.trackService.getTrackById(trackId, true, true),
    );
  }

  @ApiOkResponse({
    description: 'update Tracks details',
  })
  @UseInterceptors(NotFoundInterceptor)
  @Put('')
  async updateTracksDetails(): Promise<void> {
    return this.trackService.updateDetailsTracks();
  }

  @ApiOkResponse({ description: 'get suggestions tags' })
  @UseInterceptors(NotFoundInterceptor)
  @Get(':id/suggestions')
  async getSuggestionsTags(
    @Param('id', ParseIntPipe) trackId: string,
  ): Promise<string[]> {
    if (!trackId) throw new BadRequestException('track id missing');
    return await this.trackService.getSuggestionsTags(trackId);
  }
}
