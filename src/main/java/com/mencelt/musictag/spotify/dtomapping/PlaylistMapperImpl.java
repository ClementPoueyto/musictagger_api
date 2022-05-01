package com.mencelt.musictag.spotify.dtomapping;

import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.SpotifyPlaylistEmbedded;
import com.mencelt.musictag.entities.SpotifyTrackEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyArtist;
import com.mencelt.musictag.spotify.dto.SpotifyPlaylist;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PlaylistMapperImpl implements IPlaylistMapper {
    @Override
    public SpotifyPlaylist toDto(PlaylistEntity playlistEntity) {
        return null;
    }

    @Override
    public PlaylistEntity toEntity(SpotifyPlaylist spotifyPlaylist) {
        PlaylistEntity playlistEntity = new PlaylistEntity();
        playlistEntity.setName(spotifyPlaylist.getName());
        playlistEntity.setDescription(playlistEntity.getDescription());
        playlistEntity.setSpotifyPlaylistEmbedded(new SpotifyPlaylistEmbedded(spotifyPlaylist.getSnapshot_id(), spotifyPlaylist.getId(),spotifyPlaylist.getUri()));
        return playlistEntity;
    }


}
