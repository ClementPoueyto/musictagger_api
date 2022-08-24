import { Expose } from "class-transformer";
import { Column } from "typeorm";

export class SpotifyTrackInfoDto {
    @Expose()
    spotifyId : string;

    @Expose()
    uri : string;
}
