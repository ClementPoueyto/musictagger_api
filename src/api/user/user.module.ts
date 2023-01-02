import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.services';
import { PassportModule } from '@nestjs/passport';
import { SpotifyAuthModule } from '../authentication/spotify-auth/spotify-auth.module';
import { AuthModule } from '../authentication/auth/auth.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    SpotifyAuthModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
