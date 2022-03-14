package com.mencelt.musictag.repository;

import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<TagEntity, Long> , CrudRepository<TagEntity, Long> {

    public TagEntity findTagEntityByUserId(String userId);

    public List<TagEntity> findTagEntitiesByUserId(String userId);

    public TagEntity findTagEntityById(long id);

    public TagEntity findTagEntityByUserIdAndName(String userId, String name);

}
