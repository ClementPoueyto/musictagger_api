package com.mencelt.musictag.repository;

import com.mencelt.musictag.entities.TrackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackRepository extends JpaRepository<TrackEntity, Long> , CrudRepository<TrackEntity, Long> {

       public TrackEntity findBySpotifyId(String spotifyId);

       public TrackEntity findTrackEntityById(long spotifyId);

       public TrackEntity findTrackEntityByArtistAndAndName(String artist, String name);

}
