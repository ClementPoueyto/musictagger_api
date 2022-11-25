import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackModule } from '../track/track.module';
import { TaggedTrack } from './entities/tagged-track.entity';
import { TaggedTrackController } from './tagged-track.controller';
import { TaggedTrackService } from './tagged-track.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaggedTrack]),
    TrackModule,
    forwardRef(() => PlaylistModule),
  ],
  providers: [TaggedTrackService],
  controllers: [TaggedTrackController],
  exports: [TaggedTrackService],
})
export class TaggedTrackModule {}
