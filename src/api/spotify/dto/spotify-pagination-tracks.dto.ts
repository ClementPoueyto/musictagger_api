import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { SpotifySavedTrackDto } from "./spotify-saved-track.dto"

export class SpotifyPaginationTracksDto {

        @ApiProperty()
        @Expose()
        href: string

        @ApiProperty()
        @Expose()
        @Type(() => SpotifySavedTrackDto)
        items: SpotifySavedTrackDto[]

        @ApiProperty()
        @Expose()
        limit: number

        @ApiProperty()
        @Expose()
        next: string

        @ApiProperty()
        @Expose()
        offset: number

        @ApiProperty()
        @Expose()
        previous: string

        @ApiProperty()
        @Expose()
        total: number
      
}