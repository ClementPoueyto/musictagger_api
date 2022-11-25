import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.services';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from 'shared/shared.module';
import { SpotifyAuthModule } from 'api/authentication/spotify-auth/spotify-auth.module';
import { AuthModule } from 'api/authentication/auth/auth.module';

@Module({
  imports: [
    SpotifyAuthModule,
    SharedModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
