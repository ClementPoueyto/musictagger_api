package com.mencelt.musictag.component;

import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;
import javassist.NotFoundException;

import java.util.List;

public interface ITrackManager {

    public TrackEntity addTrack(TrackEntity trackEntity) throws RuntimeException;

    public TrackEntity getTrackBySpotifyId(String spotifyId);

    public TrackEntity getTrackById(long id) throws NotFoundException;

    public List<SpotifyTrack> search(String query, String userId) throws NotFoundException;

}
