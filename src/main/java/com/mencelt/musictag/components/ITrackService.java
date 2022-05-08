package com.mencelt.musictag.components;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyLike;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface ITrackService {

    public TrackDto addTrack(TrackEntity trackEntity) throws EntityNotFoundException;

    public TrackDto getTrackBySpotifyId(String spotifyId);

    public TrackDto getTrackById(long id) throws EntityNotFoundException;

    public TrackEntity getTrackEntityById(long id) throws EntityNotFoundException;

    public Map<TrackEntity, Timestamp> importTrack(List<SpotifyLike> spotifyLikes);
}
