import { ApiProperty } from '@nestjs/swagger';

export class CreateTaggedTrackDto {
  @ApiProperty()
  tag: string;

  @ApiProperty()
  trackId: string;
}
