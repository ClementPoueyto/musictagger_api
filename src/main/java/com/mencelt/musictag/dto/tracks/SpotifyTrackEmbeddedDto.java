package com.mencelt.musictag.dto.tracks;

import javax.persistence.Column;


public class SpotifyTrackEmbeddedDto {

    private String spotifyId;

    private String uri;


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
