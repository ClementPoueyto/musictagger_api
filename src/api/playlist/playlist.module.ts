import { forwardRef, Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { SharedModule } from 'shared/shared.module';
import { UserModule } from 'api/user/user.module';
import { TaggedTrackModule } from 'api/tagged-track/tagged-track.module';
import { SpotifyModule } from 'api/spotify/spotify.module';

@Module({
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
  imports: [
    SpotifyModule,
    UserModule,
    SharedModule,
    forwardRef(() => TaggedTrackModule),
  ],
})
export class PlaylistModule {}
