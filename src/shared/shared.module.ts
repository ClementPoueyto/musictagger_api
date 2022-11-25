import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { SpotifyUser } from './entities/spotify-user.entity';
import { TaggedTrack } from './entities/tagged-track.entity';
import { Track } from './entities/track.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Track, TaggedTrack, Playlist, SpotifyUser]),
  ],
  controllers: [],
  providers: [],
  exports: [User, Track, TaggedTrack, Playlist, SpotifyUser],
})
export class SharedModule {}
