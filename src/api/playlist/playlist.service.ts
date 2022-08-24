import { Inject, Injectable } from '@nestjs/common';
import { SpotifyService } from '../spotify/spotify.service';

@Injectable()
export class PlaylistService {

    @Inject()
    private readonly spotifyService : SpotifyService;
    constructor(){}
}
