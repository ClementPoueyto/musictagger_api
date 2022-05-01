package com.mencelt.musictag.entities;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class SpotifyPlaylistEmbedded {

    @Column(name = "snapshot_id")
    private String snapshotId;

    @Column(name = "spotify_playlist_id")
    private String spotifyPlaylistId;

    @Column(name = "uri")
    public String uri;

    public SpotifyPlaylistEmbedded() {
    }

    public SpotifyPlaylistEmbedded(String snapshotId, String spotifyPlaylistId, String uri) {
        this.snapshotId = snapshotId;
        this.spotifyPlaylistId = spotifyPlaylistId;
        this.uri = uri;
    }

    public String getSnapshotId() {
        return snapshotId;
    }

    public void setSnapshotId(String snapshotId) {
        this.snapshotId = snapshotId;
    }

    public String getSpotifyPlaylistId() {
        return spotifyPlaylistId;
    }

    public void setSpotifyPlaylistId(String spotifyPlaylistId) {
        this.spotifyPlaylistId = spotifyPlaylistId;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }
}
