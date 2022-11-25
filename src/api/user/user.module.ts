import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.services';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotifyAuthModule } from '../authentication/spotify-auth/spotify-auth.module';
import { AuthModule } from '../authentication/auth/auth.module';

@Module({
  imports: [
    SpotifyAuthModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
