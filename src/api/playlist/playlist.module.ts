import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { Playlist } from './entities/playlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
  imports : [ TypeOrmModule.forFeature([Playlist]), SpotifyModule]
})
export class PlaylistModule {}
