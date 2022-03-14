package com.mencelt.musictag.spotify.account;

import com.mencelt.musictag.entities.SpotifyUserEntity;

public interface ISpotifyAccountAPI {

    public String refreshToken(SpotifyUserEntity spotifyUserEntity);

    public String InitializeRefreshToken(String accessToken, String userId);

}
