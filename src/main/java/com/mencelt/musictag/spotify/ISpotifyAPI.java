package com.mencelt.musictag.spotify;

import com.mencelt.musictag.entities.PlaylistEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.spotify.dto.*;

import java.util.List;

public interface ISpotifyAPI {

    public List<SpotifyTrack> search(String query, UserEntity userEntity);

    public List<SpotifyLike> importTracksFromSpotify(UserEntity userEntity);

    ResponsePlaylistItem addItemPlaylist(UserEntity user, List<String> tracksURI, String playlistId);

    ResponsePlaylistItem updateItemPlaylist(UserEntity user, List<String> tracksUri, String playlistId, String snapshotId, int rangeStart, int rangeLength, int insertBefore);

    public SpotifyUser getUser(UserEntity user);

    SpotifyPlaylist createPlaylist(String name, UserEntity user, PlaylistEntity playlistEntity, String description);
}
