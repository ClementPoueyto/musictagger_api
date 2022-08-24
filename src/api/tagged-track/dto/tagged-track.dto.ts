import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { TrackDto } from "src/api/track/dto/track.dto";

export class TaggedTrackDto{
    @ApiProperty()
    @Expose()
    id : string;

    @ApiProperty()
    @Expose()
    tags : string[]

    @Expose()
    @Type(()=>TrackDto)
    track : TrackDto;

}