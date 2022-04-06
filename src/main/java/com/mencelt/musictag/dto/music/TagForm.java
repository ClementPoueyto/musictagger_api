package com.mencelt.musictag.dto.music;

import java.util.ArrayList;
import java.util.List;

public class TagForm {
    String name;
    String userId;
    List<Long> tracksId = new ArrayList<>();

    public TagForm() {
    }

    @Override
    public String toString() {
        return "TagForm{" +
                "name='" + name + '\'' +
                ", userId='" + userId + '\'' +
                ", tracksId=" + tracksId +
                '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<Long> getTracksId() {
        return tracksId;
    }

    public void setTracksId(List<Long> tracksId) {
        this.tracksId = tracksId;
    }


}
