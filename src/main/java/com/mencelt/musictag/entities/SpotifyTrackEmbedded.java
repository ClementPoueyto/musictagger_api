package com.mencelt.musictag.entities;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class SpotifyTrackEmbedded {

    @Column(name = "spotify_id")
    private String spotifyId;

    @Column(name = "uri")
    private String uri;


    public SpotifyTrackEmbedded() {
    }

    public String getSpotifyId() {
        return spotifyId;
    }

    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }
}
