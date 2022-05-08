package com.mencelt.musictag.dto.users;

import com.mencelt.musictag.entities.TagEntity;

import java.util.HashSet;
import java.util.Set;

public class UserDto {

    private String id;

    private String displayName;

    private SpotifyUserEmbeddedDto spotifyUserEmbedded;

    private Set<TagEntity> tagList = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public SpotifyUserEmbeddedDto getSpotifyUserEmbedded() {
        return spotifyUserEmbedded;
    }

    public void setSpotifyUserEmbedded(SpotifyUserEmbeddedDto spotifyUserEmbedded) {
        this.spotifyUserEmbedded = spotifyUserEmbedded;
    }

    public Set<TagEntity> getTagList() {
        return tagList;
    }

    public void setTagList(Set<TagEntity> tagList) {
        this.tagList = tagList;
    }
}
