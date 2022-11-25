import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { SharedModule } from 'shared/shared.module';
import { SpotifyModule } from 'api/spotify/spotify.module';
import { UserModule } from 'api/user/user.module';

@Module({
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
  imports: [SpotifyModule, UserModule, SharedModule],
})
export class TrackModule {}
