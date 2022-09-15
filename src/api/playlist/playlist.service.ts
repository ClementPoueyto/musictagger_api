import { Inject, Injectable, NotFoundException, UnauthorizedException, BadRequestException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { iif } from 'rxjs';
import { SpotifyPaginationPlaylistsDto } from '../spotify/dto/spotify-pagination-playlists.dto';
import { SpotifyTrackDto } from '../spotify/dto/spotify-track.dto';
import { SpotifyService } from '../spotify/spotify.service';
import { TaggedTrackService } from '../tagged-track/tagged-track.service';
import { Track } from '../track/entities/track.entity';
import { UserService } from '../user/user.services';
import { CreateSpotifyPlaylistDto } from './dto/create-spotify-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { SpotifyPlaylist } from './entities/spotify-playlist.entity';

@Injectable()
export class PlaylistService {

    @Inject()
    private readonly spotifyService : SpotifyService;

    @Inject()
    private readonly userService : UserService;

    @Inject()
    private readonly taggedtrackService : TaggedTrackService;

    constructor(){}

    async getPlaylistById(userId : string, playlistId : string){
        const playlist = await Playlist.findOne( {where :{id : playlistId}});
        if(!playlist) throw new NotFoundException('no playlist found with id '+ playlistId);
        if(playlist.userId != userId) throw new UnauthorizedException();
        return playlist;
    }

    async getPlaylistTracks(userId : string, playlistId : string){
        const playlist = await this.getPlaylistById(userId, playlistId);
        const tracks = await this.spotifyService.getPlaylistTracks(playlist.spotifyPlaylist.spotifyUserId,playlist.spotifyPlaylist.spotifyPlaylistId);
        const spotifyTracks : SpotifyTrackDto[] = tracks.items.flatMap(it=>  it.track);
        return spotifyTracks.map(tr=> this.dtoToEntitySpotifyTrackMapping(tr))
    }

    async getPlaylists(userId : string){
        const playlists = await Playlist.find({where : { userId : userId}})
        return playlists;
    }

    async createPlaylist(userId : string, createPlaylistBody : CreateSpotifyPlaylistDto, tags : string[]){
        const user = await this.userService.findById(userId);
        if(!user) throw new NotFoundException('user not found with id '+userId);
        const spotifyId = user.spotifyUser.spotifyId;
        if(!spotifyId) throw new BadRequestException('no spotify user found for this user')
        const createdPlaylist = await this.spotifyService.createPlaylist(spotifyId, createPlaylistBody);
        const playlist = this.dtoToEntitySpotifyPlaylistMapping(createdPlaylist)
        playlist.userId = userId;
        playlist.tags = tags;
        Playlist.save(playlist);
        return playlist;
    }

    async getPlaylistByTags(userId : string, tags : string[]){
        let playlistBuilder = await Playlist.createQueryBuilder("playlist")
        .where("playlist.userId = :id", {id : userId})
        for(let tag of tags){
            playlistBuilder = playlistBuilder   
            .andWhere("tags && ARRAY[:...filters]", { filters: [tag] })
        }
        const res = await playlistBuilder.getOne();
        return res;
    }

    async generatePlaylistItems(userId : string, tags : string[], createPlaylistBody : CreateSpotifyPlaylistDto){
        const user = await this.userService.findById(userId);
        if(!user) throw new NotFoundException('user not found with id '+userId);
        const spotifyId = user.spotifyUser.spotifyId;
        createPlaylistBody.description = "playlist créée avec les tags : "+tags;
        const existingPlaylist = await this.getPlaylistByTags(userId, tags);
        let playlist;
        if(existingPlaylist){
            playlist = existingPlaylist;
        }
        else{
            playlist = await this.createPlaylist(userId, createPlaylistBody, tags)
        }
        const tracks = await this.taggedtrackService.getTaggedTracks(userId,0,Number.MAX_VALUE, tags,"");
        let doRequest : boolean = true;

        let offset : number = 0 ;
        const limit : number = 100;
        while(doRequest) {
            console.log(playlist)
            await this.spotifyService.updateItemsPlaylist(spotifyId, tracks.data.map(t => t.track.spotifyTrack.uri), playlist.spotifyPlaylist.spotifyPlaylistId);
            offset ++ ;
            doRequest = tracks.data.length>(offset*limit);
        }

        return playlist;
    }

    dtoToEntitySpotifyPlaylistMapping(spotifyPlaylistDto : SpotifyPaginationPlaylistsDto) : Playlist{
        const playlist : Playlist = new Playlist();
        const spotifyPlaylist : SpotifyPlaylist = new SpotifyPlaylist();
        spotifyPlaylist.spotifyUserId = spotifyPlaylistDto.owner.id;
        spotifyPlaylist.spotifyPlaylistId = spotifyPlaylistDto.id;
        spotifyPlaylist.spotifyUri = spotifyPlaylistDto.uri;
        playlist.name = spotifyPlaylistDto.name;
        playlist.description = spotifyPlaylistDto.description;
        playlist.spotifyPlaylist = spotifyPlaylist;
        return playlist;
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
