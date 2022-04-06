package com.mencelt.musictag.entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "track", schema = "public", uniqueConstraints =
    @UniqueConstraint(name = "UniqueNameAndArtist", columnNames = { "name", "artist" }))
public class TrackEntity {

    @Id
    @GeneratedValue(strategy  = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "spotify_id")
    private String spotifyId;

    @Column(name = "artist")
    private String artist;

    @Column(name = "name")
    private String name;

    @Column(name = "image")
    private String image;

    @Column(name = "duration")
    private int duration;

    public TrackEntity() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TrackEntity)) return false;
        TrackEntity track = (TrackEntity) o;
        return artist.equals(track.artist) && name.equals(track.name);
    }

    @Override
    public String toString() {
        return "TrackEntity{" +
                "id=" + id +
                ", spotifyId='" + spotifyId + '\'' +
                ", artist='" + artist + '\'' +
                ", name='" + name + '\'' +
                ", image='" + image + '\'' +
                ", duration=" + duration +
                '}';
    }

    @Override
    public int hashCode() {
        return Objects.hash(artist, name);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getSpotifyId() {
        return spotifyId;
    }

    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
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
