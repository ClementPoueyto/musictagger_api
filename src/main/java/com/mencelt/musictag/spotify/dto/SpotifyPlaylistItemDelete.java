package com.mencelt.musictag.spotify.dto;

import java.util.List;

public class SpotifyPlaylistItemDelete {

    private List<SpotifyUri> tracks;

    private String snapshot_id;

    public SpotifyPlaylistItemDelete() {
    }


    public SpotifyPlaylistItemDelete(List<SpotifyUri> tracks, String snapshot_id) {
        this.tracks = tracks;
        this.snapshot_id = snapshot_id;
    }

    public List<SpotifyUri> getTracks() {
        return tracks;
    }

    public void setTracks(List<SpotifyUri> tracks) {
        this.tracks = tracks;
    }

    public String getSnapshot_id() {
        return snapshot_id;
    }

    public void setSnapshot_id(String snapshot_id) {
        this.snapshot_id = snapshot_id;
    }
}
