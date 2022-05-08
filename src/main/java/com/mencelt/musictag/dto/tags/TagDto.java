package com.mencelt.musictag.dto.tags;

import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.entities.TrackEntity;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

public class TagDto {

    private long id;

    private Set<String> tags = new HashSet<>();

    private TrackDto track;

    private String userId;

    private Timestamp addedAt;

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

    public TrackDto getTrack() {
        return track;
    }

    public void setTrack(TrackDto track) {
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
