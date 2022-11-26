import { forwardRef, Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { SpotifyModule } from '../spotify/spotify.module';
import { UserModule } from '../user/user.module';
import { TaggedTrackModule } from '../tagged-track/tagged-track.module';

@Module({
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
  imports: [SpotifyModule, UserModule, forwardRef(() => TaggedTrackModule)],
})
export class PlaylistModule {}
