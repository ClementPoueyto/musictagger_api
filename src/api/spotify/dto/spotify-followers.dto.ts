import { Expose } from "class-transformer"

export class SpotifyFollowersDto {

    @Expose()
    href: string

    @Expose()
    total: number
  }