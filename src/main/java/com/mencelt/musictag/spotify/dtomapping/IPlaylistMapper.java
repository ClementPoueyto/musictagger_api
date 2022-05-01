package com.mencelt.musictag.spotify.dtomapping;

import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyPlaylist;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;

public interface IPlaylistMapper {


    SpotifyPlaylist toDto(PlaylistEntity playlistEntity);

    PlaylistEntity toEntity(SpotifyPlaylist spotifyPlaylist);
}
