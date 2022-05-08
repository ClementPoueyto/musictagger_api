package com.mencelt.musictag.dto.dtomapping;

import com.mencelt.musictag.dto.playlists.PlaylistDto;
import com.mencelt.musictag.dto.playlists.SpotifyPlaylistEmbeddedDto;
import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.SpotifyPlaylistEmbedded;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PlaylistMapper implements IMapper<PlaylistEntity, PlaylistDto>{

    @Autowired
    TrackMapper trackMapper;

    @Override
    public PlaylistDto toDto(PlaylistEntity entity) {
        PlaylistDto playlistDto = new PlaylistDto();
        playlistDto.setId(entity.getId());
        playlistDto.setDescription(entity.getDescription());
        playlistDto.setName(entity.getName());
        playlistDto.setUserId(entity.getUserId());
        playlistDto.setTags(entity.getTags());
        if(entity.getTracks()!=null){
            playlistDto.setTracks(entity.getTracks().stream().map(trackMapper::toDto).collect(Collectors.toSet()));
        }
        if(entity.getSpotifyPlaylistEmbedded()!=null){
            SpotifyPlaylistEmbedded embedded = entity.getSpotifyPlaylistEmbedded();
            SpotifyPlaylistEmbeddedDto spotifyPlaylistEmbeddedDto = new SpotifyPlaylistEmbeddedDto();
            spotifyPlaylistEmbeddedDto.setSpotifyPlaylistId(embedded.getSpotifyPlaylistId());
            spotifyPlaylistEmbeddedDto.setUri(embedded.getUri());
            spotifyPlaylistEmbeddedDto.setSnapshotId(embedded.getSnapshotId());
            playlistDto.setSpotifyPlaylistEmbedded(spotifyPlaylistEmbeddedDto);
        }
        return playlistDto;
    }

    @Override
    public PlaylistEntity toEntity(PlaylistDto dto) {
        return null;
    }
}
