package com.mencelt.musictag.entities;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name="tag", schema = "public",  uniqueConstraints =
@UniqueConstraint(name = "UniqueUserAndTrack", columnNames = { "user_id" ,"track_id" }))
public class TagEntity {

    @Id
    @GeneratedValue(strategy  = GenerationType.IDENTITY)
    private long id;

    @ElementCollection
    private Set<String> tags = new HashSet<>();

    @ManyToOne(cascade = CascadeType.MERGE)
    private TrackEntity track;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "added_at")
    private Timestamp addedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TagEntity)) return false;
        TagEntity tagEntity = (TagEntity) o;
        return getTrack().equals(tagEntity.getTrack()) && getUserId().equals(tagEntity.getUserId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTrack(), getUserId());
    }

    @Override
    public String toString() {
        return "TagEntity{" +
                "id=" + id +
                ", tags=" + tags +
                ", track=" + track +
                ", userId='" + userId + '\'' +
                ", addedAt=" + addedAt +
                '}';
    }

    public TagEntity() {
    }

    public TagEntity(Set<String> tags, TrackEntity track, String userId) {
        this.tags = tags;
        this.track = track;
        this.userId = userId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    public TrackEntity getTrack() {
        return track;
    }

    public void setTrack(TrackEntity track) {
        this.track = track;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Timestamp getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(Timestamp addedAt) {
        this.addedAt = addedAt;
    }
}
