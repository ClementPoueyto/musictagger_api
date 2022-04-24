package com.mencelt.musictag.spotify.dto;

import java.sql.Timestamp;

public class SpotifyLike {

    private Timestamp added_at;

    private SpotifyTrack track;

    public SpotifyLike() {
    }

    public Timestamp getAdded_at() {
        return added_at;
    }

    public void setAdded_at(Timestamp added_at) {
        this.added_at = added_at;
    }

    public SpotifyTrack getTrack() {
        return track;
    }

    public void setTrack(SpotifyTrack track) {
        this.track = track;
    }
}
