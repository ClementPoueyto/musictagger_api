package com.mencelt.musictag.spotify.dtomapping;

import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyArtist;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TrackMapperImpl implements TrackMapper{
    @Override
    public SpotifyTrack toDto(TrackEntity trackEntity) {
        return null;
    }

    @Override
    public TrackEntity toEntity(SpotifyTrack spotifyTrack) {
        TrackEntity trackEntity = new TrackEntity();
        trackEntity.setName(spotifyTrack.getName());
        trackEntity.setDuration(spotifyTrack.getDuration_ms());
        trackEntity.setImage(spotifyTrack.getAlbum().getImages().get(2).getUrl());
        trackEntity.setSpotifyId(spotifyTrack.getId());
        trackEntity.setArtists(spotifyTrack.getArtists().stream().map(SpotifyArtist::getName).collect(Collectors.toSet()));
        trackEntity.setAlbumName(spotifyTrack.getAlbum().getName());
        trackEntity.setArtistName(spotifyTrack.getArtists().get(0).getName());
        return trackEntity;
    }


}
