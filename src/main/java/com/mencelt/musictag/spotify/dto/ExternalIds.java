package com.mencelt.musictag.spotify.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

public class ExternalIds{
    public String isrc;

    public ExternalIds() {
    }

    public String getIsrc() {
        return isrc;
    }

    public void setIsrc(String isrc) {
        this.isrc = isrc;
    }
}