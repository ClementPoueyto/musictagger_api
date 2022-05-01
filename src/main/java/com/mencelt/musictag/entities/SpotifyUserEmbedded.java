package com.mencelt.musictag.entities;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.sql.Timestamp;

@Embeddable
public class SpotifyUserEmbedded {


    @Column(name = "spotify_user_id")
    private String spotifyId;

    @Column(name = "spotify_access_token")
    private String spotifyAccessToken;

    @Column(name = "spotify_refresh_token")
    private String spotifyRefreshToken;

    @Column(name = "expires_in")
    public int expiresIn;

    @Column(name = "token_creation")
    public Timestamp tokenCreation;

    public SpotifyUserEmbedded() {
    }


    @Override
    public String toString() {
        return "SpotifyUserEntity{" +
                ", spotifyAccessToken='" + spotifyAccessToken + '\'' +
                ", spotifyRefreshToken='" + spotifyRefreshToken + '\'' +
                ", expires_in=" + expiresIn +
                '}';
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

    public int getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(int expiresIn) {
        this.expiresIn = expiresIn;
    }

    public Timestamp getTokenCreation() {
        return tokenCreation;
    }

    public void setTokenCreation(Timestamp tokenCreation) {
        this.tokenCreation = tokenCreation;
    }

    public String getSpotifyId() {
        return spotifyId;
    }

    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
    }
}
