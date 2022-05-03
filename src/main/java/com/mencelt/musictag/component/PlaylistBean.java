package com.mencelt.musictag.component;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.repository.PlaylistRepository;
import com.mencelt.musictag.spotify.dto.SpotifyPlaylist;
import com.mencelt.musictag.spotify.dtomapping.IPlaylistMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class PlaylistBean implements IPlaylistManager {

    @Autowired
    PlaylistRepository playlistRepository;

    @Autowired
    IPlaylistMapper playlistMapper;

    @Override
    public PlaylistEntity getPlaylist(String userId) throws EntityNotFoundException {
        if(userId==null) throw new EntityNotFoundException(PlaylistEntity.class, "userId", userId);
        return playlistRepository.findByUserId(userId);

    }

    @Override
    public PlaylistEntity create(SpotifyPlaylist playlist, Set<TrackEntity> tracks, UserEntity user) {
        PlaylistEntity existing = playlistRepository.findByUserId(user.getId());
        PlaylistEntity playlistEntity = playlistMapper.toEntity(playlist);
        if(existing!=null) playlistEntity.setId(existing.getId());
        playlistEntity.setUserId(user.getId());
        playlistEntity.setTracks(tracks);
        this.playlistRepository.save(playlistEntity);
        return playlistEntity;
    }

}
