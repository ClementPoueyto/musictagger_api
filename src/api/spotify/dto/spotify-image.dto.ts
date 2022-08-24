import { Expose } from "class-transformer"

export class SpotifyImageDto {

  @Expose()
  url: string

  @Expose()
  height: number

  @Expose()
  width: number
}