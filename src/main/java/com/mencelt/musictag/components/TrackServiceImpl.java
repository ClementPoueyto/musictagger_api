package com.mencelt.musictag.components;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.MissingFieldException;
import com.mencelt.musictag.dto.dtomapping.TrackMapper;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.repository.TrackRepository;
import com.mencelt.musictag.spotify.dto.SpotifyLike;
import com.mencelt.musictag.spotify.dtomapping.ITrackMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TrackServiceImpl implements ITrackService {

    @Autowired
    TrackRepository trackRepository;

    @Autowired
    ITrackMapper spotifyTrackMapper;

    @Autowired
    TrackMapper trackMapper;

    @Override
    public TrackDto addTrack(TrackEntity trackEntity)  {
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

        return trackMapper.toDto(trackEntity);

    }

    @Override
    public TrackDto getTrackBySpotifyId(String spotifyId) {
        return trackMapper.toDto(trackRepository.findBySpotifyTrackSpotifyId(spotifyId));
    }

    @Override
    public TrackDto getTrackById(long id) throws EntityNotFoundException {
       return trackMapper.toDto(getTrackEntityById(id));
    }

    @Override
    public TrackEntity getTrackEntityById(long id) throws EntityNotFoundException {
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
            TrackEntity spotifyTrackEntity = spotifyTrackMapper.toEntity(spotifyLike.getTrack());
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
