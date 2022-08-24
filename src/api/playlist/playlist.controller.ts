import { Controller, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlaylistModule } from './playlist.module';
import { PlaylistService } from './playlist.service';

@Controller('playlists')
@ApiBearerAuth()
@ApiTags('playlist')
export class PlaylistController {

    @Inject()
    private readonly playlistService : PlaylistService;
}
