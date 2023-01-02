import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SpotifyUser } from 'src/shared/entities/spotify/spotify-user.entity';
import { User } from 'src/shared/entities/user.entity';

import { AuthService } from '../authentication/auth/auth.services';
import { SpotifyUserDto } from '../authentication/spotify-auth/dto/spotify-user.dto';
import { SpotifyAuthService } from '../authentication/spotify-auth/spotify-auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  @Inject()
  public spotifyAuthService: SpotifyAuthService;

  @Inject()
  public authService: AuthService;

  @Inject()
  private readonly userRepository: UserRepository;

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.isRegisteredWithGoogle = false;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.firstname = createUserDto.firstname;
    user.lastname = createUserDto.lastname;
    const userCreated = this.userRepository.save(user).catch(() => {
      throw new ConflictException('Login already exists');
    });
    return userCreated;
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.getById(id, true);
  }

  async findByEmail(email: string) {
    return await this.userRepository.getByEmail(email, true);
  }

  async loginSpotifyAccount(userId: string, spotifyUser: SpotifyUserDto) {
    try {
      const user = await this.findById(userId);
      const currentSpotifyUser = await user.spotifyUser;

      //si l'utilisateur a deja un compte spotify différent rattaché, on supprime l'ancien
      if (
        currentSpotifyUser &&
        currentSpotifyUser.spotifyId != spotifyUser.spotifyId
      ) {
        await this.logoutSpotifyAccount(userId);
      }
      //verifie si le compte est deja attribué
      const existingSpotifyAccount = await this.spotifyAuthService.findById(
        spotifyUser.spotifyId,
      );
      if (
        existingSpotifyAccount &&
        existingSpotifyAccount.user?.id &&
        existingSpotifyAccount.user?.id != userId
      ) {
        //déconnecte l'ancien utilisateur
        await this.logoutSpotifyAccount((await existingSpotifyAccount.user).id);
      }
      //met à jour si Id identique; crée sinon
      const spotifyUserEntity = new SpotifyUser();
      spotifyUserEntity.spotifyId = spotifyUser.spotifyId;
      spotifyUserEntity.spotifyAccessToken = spotifyUser.spotifyAccessToken;
      spotifyUserEntity.spotifyRefreshToken = spotifyUser.spotifyRefreshToken;
      spotifyUserEntity.tokenCreation = new Date();
      spotifyUserEntity.expiresIn = spotifyUser.expiresIn;
      user.spotifyUser = spotifyUserEntity;
      await this.userRepository.save(user);
      return await this.authService.refreshJwtToken(user.id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async logoutSpotifyAccount(userId: string) {
    const user = await this.findById(userId);
    user.spotifyUser = null;
    await this.userRepository.save(user);
    return this.authService.refreshJwtToken(user.id);
  }
}
