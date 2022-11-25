import { ApiProperty } from '@nestjs/swagger';
import { TrackDto } from 'api/track/dto/track.dto';
import { Expose, Type } from 'class-transformer';

export class TaggedTrackDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  tags: string[];

  @Expose()
  @Type(() => TrackDto)
  track: TrackDto;
}
