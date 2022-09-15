import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class CreateSpotifyPlaylistDto{
    @Expose()
    @ApiProperty()
    name: string

    @Expose()
    @ApiProperty()
    public: boolean

    @Expose()
    @ApiProperty()
    collaborative: boolean

    @Expose()
    @ApiProperty()
    description: string
}