import { SpotifyExternalUrlsDto } from "./spotify-external-urls.dto"
import { SpotifyFollowersDto } from "./spotify-followers.dto"

export class SpotifyOwnerDto {
    external_urls: SpotifyExternalUrlsDto
    followers: SpotifyFollowersDto
    href: string
    id: string
    type: string
    uri: string
    display_name: string
  }