package com.mencelt.musictag.dto.users;

import javax.persistence.Column;
import java.sql.Timestamp;

public class SpotifyUserEmbeddedDto {

    private String spotifyId;

    private String spotifyAccessToken;

    private String spotifyRefreshToken;

    public int expiresIn;

    public Timestamp tokenCreation;

    public String getSpotifyId() {
        return spotifyId;
    }

    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
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
}
