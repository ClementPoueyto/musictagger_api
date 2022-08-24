import { BadRequestException, Controller, Get, Inject, Param, ParseIntPipe, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { TrackDto } from './dto/track.dto';
import { TrackService } from './track.service';

@Controller('tracks')
@ApiTags('track')
export class TrackController {

    @Inject()
    private readonly trackService : TrackService;

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'get liked Track by user id', type : Array<TrackDto>})
    @Get('like')
    async getLikeTrack(@Req() req: any, @Query('userId') userId : string,  @Query('offset') offset : number,
    ) : Promise<TrackDto[]>{
      if(!userId) throw new BadRequestException('user id missing');
      if(userId != req.user.id){
          throw new UnauthorizedException();
      }
      if(!req.user?.spotifyUser?.spotifyId) throw new BadRequestException('No spotify account registered')

      return await this.trackService.getLikedTrack(req.user.id,req.user.spotifyUser.spotifyId, offset);
      
    }


  @ApiOkResponse({description: 'get Track by Id', type : TrackDto})
  @Get(':id')
  async getTrackById(@Param('id',ParseIntPipe) trackId : string,
  ) : Promise<TrackDto>{
    if(!trackId) throw new BadRequestException('track id missing');
    return await plainToInstance(TrackDto,this.trackService.getTrackById(trackId));
    
  }

 
}
