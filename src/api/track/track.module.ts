import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { SpotifyModule } from '../spotify/spotify.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
  imports: [TypeOrmModule.forFeature([Track]), SpotifyModule, UserModule],
})
export class TrackModule {}
