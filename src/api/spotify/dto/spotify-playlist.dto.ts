import { SpotifyExternalUrlsDto } from "./spotify-external-urls.dto"
import { SpotifyFollowersDto } from "./spotify-followers.dto"
import { SpotifyImageDto } from "./spotify-image.dto"
import { SpotifyOwnerDto } from "./spotify-owner.dto"
import { SpotifyPaginationTracksDto } from "./spotify-response-saved-tracks.dto"

export class SpotifyPLaylistDto {
    collaborative: boolean
    description: string
    external_urls: SpotifyExternalUrlsDto
    followers: SpotifyFollowersDto
    href: string
    id: string
    images: SpotifyImageDto[]
    name: string
    owner: SpotifyOwnerDto
    public: boolean
    snapshot_id: string
    tracks: SpotifyPaginationTracksDto
    type: string
    uri: string
  }