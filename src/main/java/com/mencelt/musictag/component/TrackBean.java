package com.mencelt.musictag.component;

import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.repository.TrackRepository;
import javassist.NotFoundException;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TrackBean implements ITrackManager{


    @Autowired
    TrackRepository trackRepository;

    @Override
    public TrackEntity addTrack(TrackEntity trackEntity)  {
        System.out.println(trackEntity.toString());
        if(trackEntity.getArtist()==null||trackEntity.getName()==null){
            throw new RuntimeException("artist and name are non null fields");
        }
        else{
            TrackEntity existing = trackRepository.findTrackEntityByArtistAndAndName(trackEntity.getArtist(), trackEntity.getName());
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
        return trackRepository.findBySpotifyId(spotifyId);
    }

    @Override
    public TrackEntity getTrackById(long id) throws NotFoundException {
        TrackEntity track = trackRepository.findTrackEntityById(id);
        if(track==null){
            throw new RuntimeException("track not found with id : "+id);
        }
       return track;
    }

}
