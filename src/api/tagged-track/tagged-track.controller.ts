import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseArrayPipe, ParseIntPipe, Post, Query, Req, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { TrackDto } from '../track/dto/track.dto';
import { CreateTaggedTrackDto } from './dto/create-tagged-track.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { TaggedTrackDto } from './dto/tagged-track.dto';
import { TaggedTrack } from './entities/tagged-track.entity';
import { TaggedTrackService } from './tagged-track.service';

@Controller('tags')
@ApiTags('tag')
@ApiBearerAuth()
export class TaggedTrackController {
    @Inject(TaggedTrackService)
    private readonly taggedTrackService : TaggedTrackService;

    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({description: 'add tag to track' })
    @Post()
    async addTagToTrack(@Req() req: any,@Query('userId') userId : string,
    ) : Promise<TaggedTrackDto> {
      if(!userId) throw new BadRequestException('userId missing');
      if(userId!=req.user.id) throw new UnauthorizedException();
      return plainToInstance(TaggedTrackDto,await this.taggedTrackService.addTagToTrack(plainToInstance(CreateTaggedTrackDto, req.body), userId));
      
    }

    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({description: 'delete tag to track' })
    @Delete()
    async deleteTagToTrack(@Req() req: any,@Query('userId') userId : string,
    ) : Promise<TaggedTrackDto> {
      if(!userId) throw new BadRequestException('userId missing');
      if(userId!=req.user.id) throw new UnauthorizedException();
      return plainToInstance(TaggedTrackDto,await this.taggedTrackService.deleteTagToTrack(plainToInstance(CreateTaggedTrackDto, req.body), userId));
      
    }

    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({description: 'get all tags name' })
    @Get('names')
    async getAllTagsName(@Req() req: any,@Query('userId') userId : string,
    ) : Promise<String[]> {
      if(!userId) throw new BadRequestException('userId missing');
      if(userId!=req.user.id) throw new UnauthorizedException();
      return await this.taggedTrackService.getAllTagsName(userId);
      
    }

    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({description: 'search tags' })
    @Get()
    async searchTaggedTracks(@Req() req: any,@Query('userId') userId : string, @Query('size') size : number = 50,
     @Query('page') page : number = 0, @Query('tags',new ParseArrayPipe({ items: String, separator: ',', optional : true })) tags?: string[],
      @Query('query') query? : string, @Query('onlyMetadata') onlyMetadata? : boolean
    ) : Promise<PaginatedResultDto<TaggedTrackDto>> {
      if(!userId) throw new BadRequestException('userId missing');
      if(userId!=req.user.id) throw new UnauthorizedException();
      if(tags){
        tags = tags.map(tag=> tag.trim());
      }
      return await this.taggedTrackService.getTaggedTracks(userId, page, size, tags, query, onlyMetadata);
      
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'get liked Track by user id', type : Promise<PaginatedResultDto<TaggedTrack>>})
    @Get('like')
    async getLikeTrack(@Req() req: any, @Query('userId') userId : string,  @Query('page') page : number=0,  @Query('size') size : number = 50,
    ) : Promise<PaginatedResultDto<TaggedTrackDto>>{
      if(!userId) throw new BadRequestException('user id missing');
      if(userId != req.user.id){
          throw new UnauthorizedException();
      }
      return await this.taggedTrackService.getLikedTaggedTracks(req.user.id, page, size);
      
    }

    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({description: 'get tagged track by track id' })
    @Get('tracks/:trackId')
    async getTaggedTrackByTrackId(@Req() req: any, @Param('trackId', ParseIntPipe) trackId : string ,@Query('userId') userId : string
    ) : Promise<TaggedTrackDto> {
      if(!userId) throw new BadRequestException('userId missing');
      if(userId!=req.user.id) throw new UnauthorizedException();
      const tag =await this.taggedTrackService.getTaggedTrackByTrackId(trackId, userId);
      return  plainToInstance(TaggedTrackDto, tag);
    }

    

  

    
}
