package com.mencelt.musictag.repository;

import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>, CrudRepository<UserEntity, Long> {
    public UserEntity findUserEntityById(String id);

}
