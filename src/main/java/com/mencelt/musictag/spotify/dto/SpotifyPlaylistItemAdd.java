package com.mencelt.musictag.spotify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class SpotifyPlaylistItemAdd {

    private List<String> uris;

    private int position;

    public SpotifyPlaylistItemAdd() {
    }

    public SpotifyPlaylistItemAdd(List<String> uris, int position) {
        this.uris = uris;
        this.position = position;
    }


    public List<String> getUris() {
        return uris;
    }

    public void setUris(List<String> uris) {
        this.uris = uris;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
