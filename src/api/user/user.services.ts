import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../authentication/auth/auth.services';
import { SpotifyUserDto } from '../authentication/spotify-auth/dto/spotify-user.dto';
import { SpotifyUser } from '../authentication/spotify-auth/entities/spotify-user.entity';
import { SpotifyAuthService } from '../authentication/spotify-auth/spotify-auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  @Inject()
  public spotifyAuthService: SpotifyAuthService;

  @Inject()
  public authService: AuthService;

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    const userCreated = User.save(user).catch(_ => { throw new ConflictException('Login already exists') });
    return userCreated;

  }

  async showById(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException();
    return user;
  }

  async findById(id: string) {
    return await User.findOne({
      where: { id: id }, relations: {
        spotifyUser: true
      }
    });
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  async loginSpotifyAccount(userId: string, spotifyUser: SpotifyUserDto) {
    
    const user = await this.findById(userId);
    const currentSpotifyUser = await user.spotifyUser;
   
    //si l'utilisateur a deja un compte spotify différent rattaché, on supprime l'ancien
    if (currentSpotifyUser && currentSpotifyUser.spotifyId != spotifyUser.spotifyId) {
      await this.logoutSpotifyAccount(userId);
    }

    //verifie si le compte est deja attribué
    const existingSpotifyAccount = await this.spotifyAuthService.findById(spotifyUser.spotifyId);
    if (existingSpotifyAccount && existingSpotifyAccount.user?.id && existingSpotifyAccount.user?.id != userId) {
      //déconnecte l'ancien utilisateur
      this.logoutSpotifyAccount((await existingSpotifyAccount.user).id);
    }

    //met à jour si Id identique; crée sinon
    const spotifyUserEntity = new SpotifyUser();
    spotifyUserEntity.spotifyId = spotifyUser.spotifyId
    spotifyUserEntity.spotifyAccessToken = spotifyUser.spotifyAccessToken
    spotifyUserEntity.spotifyRefreshToken = spotifyUser.spotifyRefreshToken
    spotifyUserEntity.tokenCreation = spotifyUser.tokenCreation
    spotifyUserEntity.expiresIn = spotifyUser.expiresIn;
    user.spotifyUser = spotifyUserEntity;
    User.save(user);

    return this.authService.refresh_jwt_token(user);

  }

  async logoutSpotifyAccount(userId: string){
    const user = await this.findById(userId);
    user.spotifyUser = null;
    User.save(user);

    return this.authService.refresh_jwt_token(user);


  }

}