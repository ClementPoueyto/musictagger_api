package com.mencelt.musictag.spotify;

import com.mencelt.musictag.spotify.dto.SpotifyTrack;

import java.util.List;

public interface ISpotifyAPI {

    public List<SpotifyTrack> search(String query, String userId);

}
