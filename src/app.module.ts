import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/authentication/auth/auth.module';
import { SpotifyAuthModule } from './api/authentication/spotify-auth/spotify-auth.module';
import { PlaylistModule } from './api/playlist/playlist.module';
import { SpotifyModule } from './api/spotify/spotify.module';
import { TaggedTrackModule } from './api/tagged-track/tagged-track.module';
import { TrackModule } from './api/track/track.module';
import { UserModule } from './api/user/user.module';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm.service';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
console.log(envFilePath);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),

    AuthModule,
    UserModule,
    SpotifyAuthModule,
    SpotifyModule,
    TrackModule,
    TaggedTrackModule,
    PlaylistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
