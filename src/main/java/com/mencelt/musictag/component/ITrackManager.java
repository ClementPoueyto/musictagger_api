package com.mencelt.musictag.component;

import com.mencelt.musictag.entities.TrackEntity;
import javassist.NotFoundException;

public interface ITrackManager {

    public TrackEntity addTrack(TrackEntity trackEntity) throws RuntimeException;

    public TrackEntity getTrackBySpotifyId(String spotifyId);

    public TrackEntity getTrackById(long id) throws NotFoundException;
}
