import { forwardRef, Module } from '@nestjs/common';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackModule } from '../track/track.module';
import { TaggedTrackController } from './tagged-track.controller';
import { TaggedTrackRepository } from './tagged-track.repository';
import { TaggedTrackService } from './tagged-track.service';

@Module({
  imports: [TrackModule, forwardRef(() => PlaylistModule)],
  providers: [TaggedTrackService, TaggedTrackRepository],
  controllers: [TaggedTrackController],
  exports: [TaggedTrackService],
})
export class TaggedTrackModule {}
