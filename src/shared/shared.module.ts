import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Playlist } from './entities/playlist.entity';
import { SpotifyUser } from './entities/spotify/spotify-user.entity';
import { TaggedTrack } from './entities/tagged-track.entity';
import { Track } from './entities/track.entity';
import { User } from './entities/user.entity';
import { TypeOrmConfigService } from './services/typeorm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Track,
      TaggedTrack,
      Playlist,
      SpotifyUser,
      Artist,
    ]),
  ],
  controllers: [],
  providers: [TypeOrmConfigService],
  exports: [TypeOrmModule],
})
export class SharedModule {}
