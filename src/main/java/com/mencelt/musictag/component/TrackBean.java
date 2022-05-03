package com.mencelt.musictag.component;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.MissingFieldException;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.repository.TrackRepository;
import com.mencelt.musictag.spotify.dto.SpotifyLike;
import com.mencelt.musictag.spotify.dtomapping.ITrackMapper;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class TrackBean implements ITrackManager{

    @Autowired
    TrackRepository trackRepository;

    @Autowired
    ITrackMapper trackMapper;

    @Override
    public TrackEntity addTrack(TrackEntity trackEntity)  {
        System.out.println(trackEntity.toString());
        if(trackEntity.getArtists()==null||trackEntity.getName()==null){
            throw new MissingFieldException(TrackEntity.class, "Artists", "Name");
        }
        else{
            TrackEntity existing = trackRepository.findTrackEntityByNameAndArtistNameAndAlbumName(trackEntity.getName(),trackEntity.getArtistName(), trackEntity.getAlbumName());
            if(existing==null){
                trackRepository.save(trackEntity);
            }
            else{
                trackEntity.setId(existing.getId());
                trackRepository.save(trackEntity);
            }
        }

        return trackEntity;

    }

    @Override
    public TrackEntity getTrackBySpotifyId(String spotifyId) {
        return trackRepository.findBySpotifyTrackSpotifyId(spotifyId);
    }

    @Override
    public TrackEntity getTrackById(long id) throws EntityNotFoundException {
        TrackEntity track = trackRepository.findTrackEntityById(id);
        if(track==null){
            throw new EntityNotFoundException(TrackEntity.class, "id", String.valueOf(id));
        }
       return track;
    }

    @Override
    public Map<TrackEntity, Timestamp> importTrack(List<SpotifyLike> spotifyLikes){
        Map<TrackEntity, Timestamp> tracks = new HashMap<>();

        for(SpotifyLike spotifyLike : spotifyLikes){
            TrackEntity spotifyTrackEntity = trackMapper.toEntity(spotifyLike.getTrack());
            TrackEntity trackEntity = trackRepository.findTrackEntityByNameAndArtistNameAndAlbumName(spotifyTrackEntity.getName(),spotifyTrackEntity.getArtistName(),spotifyTrackEntity.getAlbumName());
            if(trackEntity!=null){
                spotifyTrackEntity.setId(trackEntity.getId());
            }
            tracks.put(spotifyTrackEntity, spotifyLike.getAdded_at());
        }
        trackRepository.saveAll(tracks.keySet());
        return tracks;
    }








}
