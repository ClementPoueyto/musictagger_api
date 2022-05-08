package com.mencelt.musictag.components;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.dtomapping.TrackMapper;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.dto.users.UserDto;
import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.repository.PlaylistRepository;
import com.mencelt.musictag.spotify.dto.SpotifyPlaylist;
import com.mencelt.musictag.spotify.dtomapping.IPlaylistMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PlaylistServiceImpl implements IPlaylistService {

    @Autowired
    PlaylistRepository playlistRepository;

    @Autowired
    IPlaylistMapper playlistMapper;

    @Autowired
    TrackMapper trackMapper;

    @Override
    public PlaylistEntity getPlaylist(String userId) throws EntityNotFoundException {
        if(userId==null) throw new EntityNotFoundException(PlaylistEntity.class, "userId", userId);
        return playlistRepository.findByUserId(userId);

    }

    @Override
    public PlaylistEntity create(SpotifyPlaylist playlist, Set<TrackDto> tracks, UserDto user) {
        PlaylistEntity existing = playlistRepository.findByUserId(user.getId());
        PlaylistEntity playlistEntity = playlistMapper.toEntity(playlist);
        if(existing!=null) {playlistEntity.setId(existing.getId());}
        playlistEntity.setUserId(user.getId());
        playlistEntity.setTracks(tracks.stream().map(trackMapper::toEntity).collect(Collectors.toSet()));
        this.playlistRepository.save(playlistEntity);
        return playlistEntity;
    }

}
