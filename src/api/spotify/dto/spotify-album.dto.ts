import { Exclude, Expose, Type } from "class-transformer";
import { SpotifyArtistDto } from "./spotify-artist.dto"
import { SpotifyExternalUrlsDto } from "./spotify-external-urls.dto"
import { SpotifyImageDto } from "./spotify-image.dto"
import { SpotifyRestrictionDto } from "./spotify-restriction.dto"

export class SpotifyAlbumDto {


    @Expose()
    album_type: string

    @Expose()
    total_tracks: number

    @Exclude()
    available_markets: string[]

    @Expose()
    @Type(()=>SpotifyExternalUrlsDto)
    external_urls: SpotifyExternalUrlsDto

    @Expose()
    href: string

    @Expose()
    id: string

    @Expose()
    @Type(()=>SpotifyImageDto)
    images: SpotifyImageDto[]

    @Expose()
    name: string

    @Expose()
    release_date: string

    @Expose()
    release_date_precision: string

    @Expose()
    @Type(()=>SpotifyRestrictionDto)
    restrictions: SpotifyRestrictionDto

    @Expose()
    type: string

    @Expose()
    uri: string

    @Expose()
    album_group: string

    @Expose()
    @Type(()=>SpotifyArtistDto)
    artists: SpotifyArtistDto[]
  }