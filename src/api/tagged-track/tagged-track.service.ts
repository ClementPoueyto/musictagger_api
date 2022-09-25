import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { In, Like } from 'typeorm';
import { TrackDto } from '../track/dto/track.dto';
import { Track } from '../track/entities/track.entity';
import { TrackService } from '../track/track.service';
import { UserService } from '../user/user.services';
import { CreateTaggedTrackDto } from './dto/create-tagged-track.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { TaggedTrackDto } from './dto/tagged-track.dto';
import { TaggedTrack } from './entities/tagged-track.entity';

@Injectable()
export class TaggedTrackService {

    @Inject(TrackService)
    private readonly trackService: TrackService;

    constructor() { }

    async addTagToTrack(createTag: CreateTaggedTrackDto, userId: string) {
        const track = await this.trackService.getTrackById(createTag.trackId);
        track.taggedTracks = undefined;
        const existingTaggedTrack = await TaggedTrack.findOne({ where: { track: { id: createTag.trackId }, userId: userId } });
        const taggedTrack = new TaggedTrack();
        if (existingTaggedTrack) {
            taggedTrack.id = existingTaggedTrack.id;
            taggedTrack.tags = existingTaggedTrack.tags
        }
        else{
            taggedTrack.tags = []
        }
        taggedTrack.tags.includes(createTag.tag)?null:taggedTrack.tags.push(createTag.tag)
        taggedTrack.userId = userId;
        taggedTrack.track = track;
        return TaggedTrack.save(taggedTrack);

    }

    async deleteTagToTrack(createTag: CreateTaggedTrackDto, userId: string) {
        const track = await this.trackService.getTrackById(createTag.trackId);
        track.taggedTracks = undefined;
        const existingTaggedTrack = await TaggedTrack.findOne({ where: { track: { id: createTag.trackId }, userId: userId } });
        const taggedTrack = new TaggedTrack();
        if (existingTaggedTrack) {
            taggedTrack.id = existingTaggedTrack.id;
            taggedTrack.tags = existingTaggedTrack.tags
        }
        else{
            taggedTrack.tags = [];
        }
        taggedTrack.tags= taggedTrack.tags.filter(e=> {return e != createTag.tag});
        if(taggedTrack.tags.length==0){
            TaggedTrack.remove(taggedTrack);
            return;
        }
        taggedTrack.userId = userId;
        taggedTrack.track = track;
        return TaggedTrack.save(taggedTrack);

    }

    async getTaggedTrackById(tagId : string){
       const tag = await TaggedTrack.findOne({relations : {track : true},where : {id : tagId}});
       if(!tag) throw new NotFoundException();
       return tag;
    }

    async getAllTagsName(userId : string){
        const taggedTracks = await TaggedTrack.find({where : { userId : userId} });
        const allTags = taggedTracks.sort(((a, b) => a.id < b.id ? -1 : 1))
        .flatMap(e=> e.tags);
        return Array.from(new Set(allTags));
       
    }

    async getLikedTaggedTracks(userId : string, page : number = 0, size : number = 50) : Promise<PaginatedResultDto<TaggedTrackDto>>{
        const tracksLikePagination : PaginatedResultDto<TrackDto> = await this.trackService.getLikedTrack(userId, page, size);
        const resultDto : PaginatedResultDto<TaggedTrackDto>= {
            data : tracksLikePagination.data.map(trackDto =>{

                 const taggedTrackDto = {id : trackDto?.taggedTracks?.length>0?trackDto?.taggedTracks[0]?.id:undefined, tags : trackDto?.taggedTracks?.length>0?trackDto?.taggedTracks[0]?.tags:[], track : trackDto}
                delete taggedTrackDto.track.taggedTracks
                return taggedTrackDto;
                }),
                metadata : tracksLikePagination.metadata
        }
        return resultDto;
    }

    async getTaggedTracks(userId : string, page : number = 0, limit : number = 50, tags : Array<String> = [], query : string = "") : Promise<PaginatedResultDto<TaggedTrackDto>>{
        if(!limit || limit > 50) {limit = 50};
        if(!page) { page = 0;}
        let taggedTracksBuilder = await TaggedTrack.createQueryBuilder("taggedtrack")
        .innerJoinAndSelect("taggedtrack.track", "track")
        .where("taggedtrack.userId = :id", {id : userId})
        for(let tag of tags){
            taggedTracksBuilder = taggedTracksBuilder   
            .andWhere("tags && ARRAY[:...filters]", { filters: [tag] })
        }
        taggedTracksBuilder
        .andWhere("(LOWER(track.title) LIKE LOWER(:query) OR LOWER(track.artistName) LIKE LOWER(:query) OR LOWER(track.albumTitle) LIKE LOWER(:query))",
        { 
          query: "%"+query+"%",
        }) 
        taggedTracksBuilder.orderBy("taggedtrack.id", "DESC")
        .limit(limit || 50)
        .offset(page*limit || 0)
        
        const res = await taggedTracksBuilder.getManyAndCount();
        const resultDto : PaginatedResultDto<TaggedTrackDto>= {
            data : plainToInstance(TaggedTrackDto, res[0], { excludeExtraneousValues: true }),
            metadata : {
                total : res[1],
                page : page,
                limit : limit
            }
        }
          

        return resultDto;
    }
}
