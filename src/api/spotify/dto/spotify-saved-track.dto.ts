import { Expose, Type } from "class-transformer";
import { SpotifyTrackDto } from "./spotify-track.dto";

export class SpotifySavedTrackDto { 

    @Expose()
    added_at : Date;
    @Expose()
    @Type(() => SpotifyTrackDto)
    track : SpotifyTrackDto
}