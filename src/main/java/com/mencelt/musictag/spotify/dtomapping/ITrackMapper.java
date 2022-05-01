package com.mencelt.musictag.spotify.dtomapping;

import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;
public interface ITrackMapper {

    SpotifyTrack toDto(TrackEntity trackEntity);

    TrackEntity toEntity(SpotifyTrack spotifyTrack);

}
