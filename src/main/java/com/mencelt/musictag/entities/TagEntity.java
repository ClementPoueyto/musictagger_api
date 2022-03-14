package com.mencelt.musictag.entities;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name="tag", schema = "public")
public class TagEntity {

    @Id
    @GeneratedValue(strategy  = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "name")
    private String name;

    @OneToMany(cascade = CascadeType.PERSIST)
    private Set<TrackEntity> trackList = new HashSet<>();

    @Column(name = "user_id")
    private String userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TagEntity)) return false;
        TagEntity tag = (TagEntity) o;
        return name.equals(tag.name) && userId.equals(tag.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, userId);
    }

    @Override
    public String toString() {
        return "TagEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", trackList=" + trackList +
                ", userId='" + userId + '\'' +
                '}';
    }

    public TagEntity() {
    }

    public TagEntity(String name, String userId) {
        this.name = name;
        this.userId = userId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<TrackEntity> getTrackList() {
        return trackList;
    }

    public void setTrackList(Set<TrackEntity> trackList) {
        this.trackList = trackList;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
