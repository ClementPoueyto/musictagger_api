package com.mencelt.musictag.spotify.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

class ExternalUrls{
    public String spotify;

    public ExternalUrls() {
    }

    public String getSpotify() {
        return spotify;
    }

    public void setSpotify(String spotify) {
        this.spotify = spotify;
    }
}
