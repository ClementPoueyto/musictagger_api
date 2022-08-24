import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { SpotifyAuthService } from '../authentication/spotify-auth/spotify-auth.service';
import { SpotifyPaginationTracksDto } from './dto/spotify-response-saved-tracks.dto';

@Injectable()
export class SpotifyService {
  private SPOTIFY_URL: string = "https://api.spotify.com/v1/";

  @Inject()
  private readonly spotifyAuthService: SpotifyAuthService;

  constructor(private httpService: HttpService) { }
  private getHeaders(accessToken: string) {
    return {
      "Accept": "application/json",
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    }
  }

  async getLikedTracks(spotifyId: string, limit=50, offset=0) {

    const token = await this.spotifyAuthService.getAccessToken(spotifyId);
         const res =await this.httpService.axiosRef.get(this.SPOTIFY_URL + "me/tracks?limit=" + limit + "&offset=" + offset*limit, { headers: this.getHeaders(token) })
        .catch((e)=>{
          if(e.response.status == HttpStatus.UNAUTHORIZED){
            console.log(e)
          }
        }
        );

        if(res&&res.status==HttpStatus.OK){
          return plainToInstance(SpotifyPaginationTracksDto, res.data, { excludeExtraneousValues: true })
        }

  }

  async createPlaylsit(spotifyId: string){

  }

  async updatePlaylist(){

  }

  async deletePlaylist(){

  }

  async getPlaylist(){

  }



}
