package com.mencelt.musictag.component;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.spotify.dto.SpotifyPlaylist;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface IPlaylistManager {

    public PlaylistEntity getPlaylist(String userId) throws EntityNotFoundException;

    PlaylistEntity create(SpotifyPlaylist playlist, Set<TrackEntity> tracks, UserEntity user);
}
