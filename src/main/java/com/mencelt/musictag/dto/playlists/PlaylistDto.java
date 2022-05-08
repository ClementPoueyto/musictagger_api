package com.mencelt.musictag.dto.playlists;

import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.dto.users.SpotifyUserEmbeddedDto;
import com.mencelt.musictag.entities.SpotifyPlaylistEmbedded;
import com.mencelt.musictag.entities.TrackEntity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

public class PlaylistDto {

    private long id;

    private String name;

    private String description;

    private String userId;

    private Set<String> tags = new HashSet<>();

    private Set<TrackDto> tracks  = new HashSet<>();

    private SpotifyPlaylistEmbeddedDto spotifyPlaylistEmbedded;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    public Set<TrackDto> getTracks() {
        return tracks;
    }

    public void setTracks(Set<TrackDto> tracks) {
        this.tracks = tracks;
    }

    public SpotifyPlaylistEmbeddedDto getSpotifyPlaylistEmbedded() {
        return spotifyPlaylistEmbedded;
    }

    public void setSpotifyPlaylistEmbedded(SpotifyPlaylistEmbeddedDto spotifyPlaylistEmbedded) {
        this.spotifyPlaylistEmbedded = spotifyPlaylistEmbedded;
    }
}
