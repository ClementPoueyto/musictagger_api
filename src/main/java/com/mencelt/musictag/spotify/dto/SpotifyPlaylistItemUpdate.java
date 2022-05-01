package com.mencelt.musictag.spotify.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public class SpotifyPlaylistItemUpdate {

    private List<String> uris;


    public SpotifyPlaylistItemUpdate() {
    }

    public SpotifyPlaylistItemUpdate(List<String> uris) {
        this.uris = uris;
    }



    public List<String> getUris() {
        return uris;
    }

    public void setUris(List<String> uris) {
        this.uris = uris;
    }



}
