import { forwardRef, Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { SpotifyModule } from '../spotify/spotify.module';
import { UserModule } from '../user/user.module';
import { TaggedTrackModule } from '../tagged-track/tagged-track.module';
import { PlaylistRepository } from './playlist.repository';

@Module({
  providers: [PlaylistService, PlaylistRepository],
  controllers: [PlaylistController],
  exports: [PlaylistService],
  imports: [SpotifyModule, UserModule, forwardRef(() => TaggedTrackModule)],
})
export class PlaylistModule {}
