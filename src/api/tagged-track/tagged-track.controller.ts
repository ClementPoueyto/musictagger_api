import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { TaggedTrack } from 'src/shared/entities/tagged-track.entity';
import { UserIdRequiredException } from 'src/shared/errors/user-id-required.error';
import { NotFoundInterceptor } from 'src/shared/interceptors/not-found.interceptor';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { CreateTaggedTrackDto } from './dto/create-tagged-track.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { TaggedTrackDto } from './dto/tagged-track.dto';
import { TaggedTrackService } from './tagged-track.service';

@Controller('tags')
@ApiTags('tag')
@ApiBearerAuth()
export class TaggedTrackController {
  @Inject(TaggedTrackService)
  private readonly taggedTrackService: TaggedTrackService;

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'add tag to track' })
  @UseInterceptors(NotFoundInterceptor)
  @Post()
  async addTagToTrack(
    @Req() req: any,
    @Query('userId') userId: string,
  ): Promise<TaggedTrackDto> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    return plainToInstance(
      TaggedTrackDto,
      await this.taggedTrackService.addTagToTrack(
        plainToInstance(CreateTaggedTrackDto, req.body),
        userId,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'delete tag to track' })
  @UseInterceptors(NotFoundInterceptor)
  @Delete()
  async deleteTagToTrack(
    @Req() req: any,
    @Query('userId') userId: string,
  ): Promise<TaggedTrackDto> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    return plainToInstance(
      TaggedTrackDto,
      await this.taggedTrackService.deleteTagToTrack(
        plainToInstance(CreateTaggedTrackDto, req.body),
        userId,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'get all tags name' })
  @UseInterceptors(NotFoundInterceptor)
  @Get('names')
  async getAllTagsName(
    @Req() req: any,
    @Query('userId') userId: string,
  ): Promise<string[]> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    return await this.taggedTrackService.getAllTagsName(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'search tags' })
  @UseInterceptors(NotFoundInterceptor)
  @Get()
  async searchTaggedTracks(
    @Req() req: any,
    @Query('userId') userId: string,
    @Query('size') size = 50,
    @Query('page') page = 0,
    @Query(
      'tags',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    tags?: string[],
    @Query('query') query?: string,
    @Query('onlyMetadata') onlyMetadata?: boolean,
  ): Promise<PaginatedResultDto<TaggedTrackDto>> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    if (tags) {
      tags = tags.map((tag) => tag.trim());
    }
    return await this.taggedTrackService.getTaggedTracks(
      userId,
      page,
      size,
      tags,
      query,
      onlyMetadata,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'get liked Track by user id',
    type: Promise<PaginatedResultDto<TaggedTrack>>,
  })
  @UseInterceptors(NotFoundInterceptor)
  @Get('like')
  async getLikeTrack(
    @Req() req: any,
    @Query('userId') userId: string,
    @Query('page') page = 0,
    @Query('size') size = 50,
  ): Promise<PaginatedResultDto<TaggedTrackDto>> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) {
      throw new UnauthorizedException();
    }
    return await this.taggedTrackService.getLikedTaggedTracks(
      req.user.id,
      page,
      size,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'get tagged track by track id' })
  @UseInterceptors(NotFoundInterceptor)
  @Get('tracks/:trackId')
  async getTaggedTrackByTrackId(
    @Req() req: any,
    @Param('trackId', ParseIntPipe) trackId: string,
    @Query('userId') userId: string,
  ): Promise<TaggedTrackDto> {
    if (!userId) throw new UserIdRequiredException();
    if (userId != req.user.id) throw new UnauthorizedException();
    const tag = await this.taggedTrackService.getTaggedTrackByTrackId(
      trackId,
      userId,
    );
    return plainToInstance(TaggedTrackDto, tag);
  }
}
