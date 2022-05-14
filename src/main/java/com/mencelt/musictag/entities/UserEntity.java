package com.mencelt.musictag.entities;

import com.mencelt.musictag.dto.users.UserForm;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name="user", schema = "public")
public class UserEntity {
    @Id
    @Column(name = "id")
    private String id;

    @Embedded
    private SpotifyUserEmbedded spotifyUserEmbedded;

    @OneToMany(cascade = CascadeType.PERSIST)
    private Set<TagEntity> tagList = new HashSet<>();

    public UserEntity() {
    }

    public UserEntity(UserForm form) {
        this.id = form.getId();
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "id='" + id + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserEntity)) return false;
        UserEntity that = (UserEntity) o;
        return getId().equals(that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public SpotifyUserEmbedded getSpotifyUser() {
        return spotifyUserEmbedded;
    }

    public void setSpotifyUser(SpotifyUserEmbedded spotifyUserEmbedded) {
        this.spotifyUserEmbedded = spotifyUserEmbedded;
    }

    public Set<TagEntity> getTagList() {
        return tagList;
    }

    public void setTagList(Set<TagEntity> tagList) {
        this.tagList = tagList;
    }
}
