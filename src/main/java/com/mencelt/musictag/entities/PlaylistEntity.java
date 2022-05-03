package com.mencelt.musictag.entities;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "playlist", schema = "public", uniqueConstraints =
@UniqueConstraint(name = "UniqueByUser", columnNames = { "user_id" }))
public class PlaylistEntity {

    @Id
    @GeneratedValue(strategy  = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "user_id")
    private String userId;

    @ElementCollection
    private Set<String> tags = new HashSet<>();

    @ManyToMany
    private Set<TrackEntity> tracks  = new HashSet<>();

    @Embedded
    private SpotifyPlaylistEmbedded spotifyPlaylistEmbedded;

    public PlaylistEntity() {
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

    public SpotifyPlaylistEmbedded getSpotifyPlaylistEmbedded() {
        return spotifyPlaylistEmbedded;
    }

    public void setSpotifyPlaylistEmbedded(SpotifyPlaylistEmbedded spotifyPlaylistEmbedded) {
        this.spotifyPlaylistEmbedded = spotifyPlaylistEmbedded;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    public Set<TrackEntity> getTracks() {
        return tracks;
    }

    public void setTracks(Set<TrackEntity> tracks) {
        this.tracks = tracks;
    }
}
