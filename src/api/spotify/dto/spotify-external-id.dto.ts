import { Expose } from "class-transformer"

export class SpotifyExternalIdDto {

    @Expose()
    isrc: string

    @Expose()
    ean: string

    @Expose()
    upc: string
  }