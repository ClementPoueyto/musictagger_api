package com.mencelt.musictag.components;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.dto.users.UserDto;
import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.spotify.dto.SpotifyPlaylist;

import java.util.Set;

public interface IPlaylistService {

    public PlaylistEntity getPlaylist(String userId) throws EntityNotFoundException;

    PlaylistEntity create(SpotifyPlaylist playlist, Set<TrackDto> tracks, UserDto user);
}
