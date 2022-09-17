import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SpotifyTrackDto } from '../spotify/dto/spotify-track.dto';
import { SpotifyService } from '../spotify/spotify.service';
import { TaggedTrack } from '../tagged-track/entities/tagged-track.entity';
import { UserService } from '../user/user.services';
import { TrackDto } from './dto/track.dto';
import { Track } from './entities/track.entity';
import { BadRequestException} from '@nestjs/common';

@Injectable()
export class TrackService {

    @Inject()
    private readonly spotifyService: SpotifyService;

    @Inject()
    private readonly userService : UserService;

    constructor() { }

    async getTrackById(id: string) {
        const track = await Track.findOne({relations : { taggedTracks : true}, where: { id: id } });
        if (!track) throw new NotFoundException('track not found with id : ' + id)
        return track;
    }

    async getLikedTrack(userId : string, offset: number) {
        const user = await this.userService.findById(userId);
        if(!user||!user.spotifyUser?.spotifyId) throw new BadRequestException('No spotify account registered')
        const spotifyId = user.spotifyUser.spotifyId;
        const spotifyLikedTracks = await this.spotifyService.getLikedTracks(spotifyId, 50, offset);
        const spotifyLikedTracksEntities = spotifyLikedTracks.items.map(item => this.dtoToEntitySpotifyTrackMapping(item.track));
        const res = [];
        for(let e of spotifyLikedTracksEntities){
           await Track.createQueryBuilder('track').leftJoinAndMapOne("track.taggedtracks", TaggedTrack, "taggedtrack","taggedtrack.trackId = track.id  and taggedtrack.userId = :userId", {userId : userId})
           .where(
            'track.title = :title and track.albumTitle = :albumTitle and track.artistName = :artistName', { title : e.title, albumTitle : e.albumTitle, artistName : e.artistName}, 
           ).getOne()
           .catch()
            .then(track => {
                if(track){
                e.id = track.id
                Track.save(e).catch(e => { console.log(e.message) });
                res.push(track)
                }
            });
        }
        return res.map(track => plainToInstance(TrackDto, track));
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
