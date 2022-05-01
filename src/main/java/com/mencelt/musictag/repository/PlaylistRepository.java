package com.mencelt.musictag.repository;

import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.TrackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends JpaRepository<PlaylistEntity, Long> , CrudRepository<PlaylistEntity, Long> {

       public PlaylistEntity findByUserId(String userId);


}
