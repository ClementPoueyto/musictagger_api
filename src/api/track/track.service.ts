import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SpotifyTrackDto } from '../spotify/dto/spotify-track.dto';
import { SpotifyService } from '../spotify/spotify.service';
import { TaggedTrack } from '../tagged-track/entities/tagged-track.entity';
import { UserService } from '../user/user.services';
import { TrackDto } from './dto/track.dto';
import { Track } from './entities/track.entity';
import { BadRequestException} from '@nestjs/common';
import { PaginatedResultDto } from '../tagged-track/dto/paginated-result.dto';

@Injectable()
export class TrackService {

    @Inject()
    private readonly spotifyService: SpotifyService;

    @Inject()
    private readonly userService : UserService;

    constructor() { }

    async getTrackById(id: string, relation : boolean) {
        const track = await Track.findOne({relations : { taggedTracks : relation}, where: { id: id } });
        if (!track) throw new NotFoundException('track not found with id : ' + id)
        return track;
    }

    async getLikedTrack(userId : string, page: number=0, size : number = 50) : Promise<PaginatedResultDto<TrackDto>> {
        const user = await this.userService.findById(userId);
        if(!user||!user.spotifyUser?.spotifyId) throw new BadRequestException('No spotify account registered')
        const spotifyId = user.spotifyUser.spotifyId;
        const spotifyLikedTracks = await this.spotifyService.getLikedTracks(spotifyId, size, page);
        const spotifyLikedTracksEntities = spotifyLikedTracks.items.map(item => this.dtoToEntitySpotifyTrackMapping(item.track));
  
        for(let trackEntity of spotifyLikedTracksEntities){
            try{
                await Track.save(trackEntity);
            }
            catch(err){}
        }

        const res = [];
        
        for(let e of spotifyLikedTracksEntities){
           await Track.createQueryBuilder('track').leftJoinAndMapOne("track.taggedTrack", TaggedTrack, "taggedTrack","taggedTrack.trackId = track.id  and taggedTrack.userId = :userId", {userId : userId})
           .where(
            'track.title = :title and track.albumTitle = :albumTitle and track.artistName = :artistName', { title : e.title, albumTitle : e.albumTitle, artistName : e.artistName}, 
           ).getOne()
           .catch(err=>{console.log(err)})
            .then(track => {
                if(track && track["taggedTrack"]){
                    track.taggedTracks = [];
                    track.taggedTracks.push(track["taggedTrack"]);
                }
                res.push(track);
            });

        }
        return {data : res.map(track => plainToInstance(TrackDto, track,{excludeExtraneousValues : true} )),
        metadata : {
                page : page,
                total : spotifyLikedTracks.total,
                limit : size
            }};
    }

    private dtoToEntitySpotifyTrackMapping(trackDto: SpotifyTrackDto): Track {
        const track = new Track();
        track.artistName = trackDto.artists[0].name;
        track.albumTitle = trackDto.album.name;
        track.artists = trackDto.artists.map(art => art.name);
        track.title = trackDto.name;
        track.image = trackDto.album.images[0].url;
        track.duration = trackDto.duration_ms;
        track.spotifyTrack = { spotifyId: trackDto.id, uri: trackDto.uri }
        return track;
    }

}
