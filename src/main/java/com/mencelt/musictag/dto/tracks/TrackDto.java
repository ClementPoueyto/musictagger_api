package com.mencelt.musictag.dto.tracks;

import com.mencelt.musictag.entities.SpotifyTrackEmbedded;
import com.mencelt.musictag.entities.TrackEntity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

public class TrackDto {

    private long id;

    private SpotifyTrackEmbeddedDto spotifyTrack;

    private String artistName;

    private String albumName;

    private Set<String> artists = new HashSet<>();

    private String name;

    private String image;

    private int duration;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public SpotifyTrackEmbeddedDto getSpotifyTrack() {
        return spotifyTrack;
    }

    public void setSpotifyTrack(SpotifyTrackEmbeddedDto spotifyTrack) {
        this.spotifyTrack = spotifyTrack;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getAlbumName() {
        return albumName;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
    }

    public Set<String> getArtists() {
        return artists;
    }

    public void setArtists(Set<String> artists) {
        this.artists = artists;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
}
