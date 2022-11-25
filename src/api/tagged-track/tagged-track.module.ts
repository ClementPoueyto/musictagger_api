import { forwardRef, Module } from '@nestjs/common';
import { PlaylistModule } from 'api/playlist/playlist.module';
import { TrackModule } from 'api/track/track.module';
import { SharedModule } from 'shared/shared.module';
import { TaggedTrackController } from './tagged-track.controller';
import { TaggedTrackService } from './tagged-track.service';

@Module({
  imports: [TrackModule, forwardRef(() => PlaylistModule), SharedModule],
  providers: [TaggedTrackService],
  controllers: [TaggedTrackController],
  exports: [TaggedTrackService],
})
export class TaggedTrackModule {}
