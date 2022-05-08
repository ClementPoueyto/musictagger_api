package com.mencelt.musictag.dto.tags;

import java.util.List;
import java.util.Objects;

public class TagForm {
    List<String> tags;
    String userId;
    long trackId;

    public TagForm() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TagForm)) return false;
        TagForm tagForm = (TagForm) o;
        return getTrackId() == tagForm.getTrackId() && Objects.equals(getTags(), tagForm.getTags()) && Objects.equals(getUserId(), tagForm.getUserId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTags(), getUserId(), getTrackId());
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public long getTrackId() {
        return trackId;
    }

    public void setTrackId(long trackId) {
        this.trackId = trackId;
    }
}
