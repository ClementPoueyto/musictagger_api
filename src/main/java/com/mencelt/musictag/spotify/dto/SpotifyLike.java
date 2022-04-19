package com.mencelt.musictag.spotify.dto;

public class SpotifyLike {

    private String added_at;

    private SpotifyTrack track;

    public SpotifyLike() {
    }

    public String getAdded_at() {
        return added_at;
    }

    public void setAdded_at(String added_at) {
        this.added_at = added_at;
    }

    public SpotifyTrack getTrack() {
        return track;
    }

    public void setTrack(SpotifyTrack track) {
        this.track = track;
    }
}
