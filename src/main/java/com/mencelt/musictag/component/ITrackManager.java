package com.mencelt.musictag.component;

import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyLike;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;
import javassist.NotFoundException;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface ITrackManager {

    public TrackEntity addTrack(TrackEntity trackEntity) throws RuntimeException;

    public TrackEntity getTrackBySpotifyId(String spotifyId);

    public TrackEntity getTrackById(long id) throws NotFoundException;

    public Map<TrackEntity, Timestamp> importTrack(List<SpotifyLike> spotifyLikes);
}
