package com.mencelt.musictag.entities;

import com.mencelt.musictag.model.user.UserForm;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name="spotify_user", schema = "public")
public class SpotifyUserEntity {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "spotify_access_token")
    private String spotifyAccessToken;

    @Column(name = "spotify_refresh_token")
    private String spotifyRefreshToken;

    @Column(name = "expires_in")
    public int expires_in;

    @Column(name = "token_creation")
    public Timestamp token_creation;

    @OneToOne(cascade = CascadeType.ALL)
    private UserEntity userEntity;

    public SpotifyUserEntity() {
    }


    @Override
    public String toString() {
        return "SpotifyUserEntity{" +
                "id='" + id + '\'' +
                ", spotifyAccessToken='" + spotifyAccessToken + '\'' +
                ", spotifyRefreshToken='" + spotifyRefreshToken + '\'' +
                ", expires_in=" + expires_in +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SpotifyUserEntity)) return false;
        SpotifyUserEntity that = (SpotifyUserEntity) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSpotifyAccessToken() {
        return spotifyAccessToken;
    }

    public void setSpotifyAccessToken(String spotifyAccessToken) {
        this.spotifyAccessToken = spotifyAccessToken;
    }

    public String getSpotifyRefreshToken() {
        return spotifyRefreshToken;
    }

    public void setSpotifyRefreshToken(String spotifyRefreshToken) {
        this.spotifyRefreshToken = spotifyRefreshToken;
    }

    public int getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(int expires_in) {
        this.expires_in = expires_in;
    }

    public Timestamp getToken_creation() {
        return token_creation;
    }

    public void setToken_creation(Timestamp token_creation) {
        this.token_creation = token_creation;
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }
}
