package com.mencelt.musictag.entities;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "track", schema = "public", uniqueConstraints =
@UniqueConstraint(name = "UniqueNameAndArtists", columnNames = { "name", "artist_name" ,"album_name" }))
public class TrackEntity {

    @Id
    @GeneratedValue(strategy  = GenerationType.IDENTITY)
    private long id;

    @Embedded
    private SpotifyTrackEmbedded spotifyTrack;

    @Column(name = "artist_name")
    private String artistName;

    @Column(name = "album_name")
    private String albumName;

    @ElementCollection
    private Set<String> artists = new HashSet<>();

    @Column(name = "name")
    private String name;

    @Column(name = "image")
    private String image;

    @Column(name = "duration")
    private int duration;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TrackEntity)) return false;
        TrackEntity that = (TrackEntity) o;
        return getArtistName().equals(that.getArtistName()) && getAlbumName().equals(that.getAlbumName()) && getName().equals(that.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getArtistName(), getAlbumName(), getName());
    }

    public TrackEntity() {
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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public SpotifyTrackEmbedded getSpotifyTrack() {
        return spotifyTrack;
    }

    public void setSpotifyTrack(SpotifyTrackEmbedded spotifyTrack) {
        this.spotifyTrack = spotifyTrack;
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
