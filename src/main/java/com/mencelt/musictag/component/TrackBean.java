package com.mencelt.musictag.component;

import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.repository.TrackRepository;
import com.mencelt.musictag.spotify.ISpotifyAPI;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;
import javassist.NotFoundException;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class TrackBean implements ITrackManager{


    @Autowired
    TrackRepository trackRepository;

    @Autowired
    ITagManager tagManager;

    @Autowired
    ISpotifyAPI spotifyAPI;

    @Override
    public TrackEntity addTrack(TrackEntity trackEntity)  {
        System.out.println(trackEntity.toString());
        if(trackEntity.getArtists()==null||trackEntity.getName()==null){
            throw new RuntimeException("artist and name are non null fields");
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

    @Override
    public List<SpotifyTrack> search(String query, String userId) throws NotFoundException {
        return spotifyAPI.search(query, userId);
    }






}
