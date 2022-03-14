package com.mencelt.musictag.repository;

import com.mencelt.musictag.entities.SpotifyUserEntity;
import com.mencelt.musictag.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotifyUserRepository extends JpaRepository<SpotifyUserEntity, Long>, CrudRepository<SpotifyUserEntity, Long> {
    public SpotifyUserEntity findSpotifyUserEntityById(String id);

}
