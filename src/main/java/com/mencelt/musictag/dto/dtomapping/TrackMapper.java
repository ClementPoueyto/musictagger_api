package com.mencelt.musictag.dto.dtomapping;

import com.mencelt.musictag.dto.tracks.SpotifyTrackEmbeddedDto;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.entities.SpotifyTrackEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import org.springframework.stereotype.Component;

@Component
public class TrackMapper implements IMapper<TrackEntity, TrackDto> {
    @Override
    public TrackDto toDto(TrackEntity entity) {
        TrackDto dto  =new TrackDto();
        dto.setArtistName(entity.getArtistName());
        dto.setAlbumName(entity.getAlbumName());
        dto.setDuration(entity.getDuration());
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setImage(entity.getImage());
        dto.setArtists(entity.getArtists());
        if(entity.getSpotifyTrack()!=null){
            SpotifyTrackEmbedded embedded = entity.getSpotifyTrack();
            SpotifyTrackEmbeddedDto spotifyTrackDto = new SpotifyTrackEmbeddedDto();
            spotifyTrackDto.setUri(embedded.getUri());
            spotifyTrackDto.setSpotifyId(embedded.getSpotifyId());
            dto.setSpotifyTrack(spotifyTrackDto);
        }
        return dto;
    }

    @Override
    public TrackEntity toEntity(TrackDto dto) {
        TrackEntity entity  =new TrackEntity();
        entity.setArtistName(dto.getArtistName());
        entity.setAlbumName(dto.getAlbumName());
        entity.setDuration(dto.getDuration());
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setImage(dto.getImage());
        entity.setArtists(dto.getArtists());
        if(dto.getSpotifyTrack()!=null){
            SpotifyTrackEmbedded embedded = new SpotifyTrackEmbedded();
            SpotifyTrackEmbeddedDto spotifyTrackDto = dto.getSpotifyTrack();
            embedded.setUri(spotifyTrackDto.getUri());
            embedded.setSpotifyId(spotifyTrackDto.getSpotifyId());
            entity.setSpotifyTrack(embedded);
        }
        return entity;
    }
}
