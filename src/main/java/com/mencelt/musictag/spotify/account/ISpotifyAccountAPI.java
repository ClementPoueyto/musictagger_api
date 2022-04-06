package com.mencelt.musictag.spotify.account;

import com.mencelt.musictag.entities.UserEntity;

public interface ISpotifyAccountAPI {

    public String refreshToken(UserEntity spotifyUser);

    public String InitializeRefreshToken(String accessToken, String userId);

}
