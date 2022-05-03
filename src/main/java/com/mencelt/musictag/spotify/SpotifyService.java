package com.mencelt.musictag.spotify;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.MissingFieldException;
import com.mencelt.musictag.apierror.exceptions.NoSpotifyConnectionException;
import com.mencelt.musictag.entities.*;
import com.mencelt.musictag.spotify.account.ISpotifyAccountAPI;
import com.mencelt.musictag.spotify.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SpotifyService implements ISpotifyAPI {

    private final String SPOTIFY_URL = "https://api.spotify.com/v1/";

    private final RestTemplate restTemplate = new RestTemplate();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    ISpotifyAccountAPI ISpotifyAccountAPI;


    @Override
    public List<SpotifyTrack> search(String query, UserEntity user) {
        String accessToken = getSpotifyAccessToken(user);
        ResponseEntity<String> response = prepareGetRequest(SPOTIFY_URL + "search?q=\" + query + \"&type=track",accessToken);
        try {
            SpotifySearch search = objectMapper.readValue(response.getBody(), SpotifySearch.class);
            if (response.getStatusCode() == HttpStatus.OK) {

                return search.getTracks().getItems();
            } else {
                return null;
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<SpotifyLike> importTracksFromSpotify(UserEntity user) {
        String accessToken = getSpotifyAccessToken(user);
        List<SpotifyLike> spotifyTracks = new ArrayList<>();
        boolean doRequest = true;
        try {
            int offset = 0;
            final int limit = 50;
            while(doRequest) {
                ResponseEntity<String> response = prepareGetRequest(SPOTIFY_URL + "me/tracks?limit="+limit+"&offset="+offset, accessToken);
                Like likedTracks = objectMapper.readValue(response.getBody(), Like.class);
                if (response.getStatusCode() == HttpStatus.OK) {
                    spotifyTracks.addAll(likedTracks.getItems());
                } else {
                    return null;
                }
                if(likedTracks.next!=null){
                    offset+=limit;
                }else{
                    doRequest = false;
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        System.out.println(spotifyTracks.size());
        return spotifyTracks;
    }

    @Override
    public ResponsePlaylistItem addItemPlaylist(UserEntity user, List<String> tracksURI, String playlistId) {
        String accessToken = getSpotifyAccessToken(user);
        if(user.getSpotifyUser().getSpotifyId()==null) throw new NoSpotifyConnectionException(user.getId());
        try{
           ResponseEntity<String> responseUpdate = prepareAddItemPlaylistRequest(SPOTIFY_URL + "playlists/"+playlistId+"/tracks", accessToken, new SpotifyPlaylistItemAdd( tracksURI, 0));
            ResponsePlaylistItem responsePlaylistUpdate = objectMapper.readValue(responseUpdate.getBody(), ResponsePlaylistItem.class);
            if (responseUpdate.getStatusCode() == HttpStatus.CREATED) {
                System.out.println(responsePlaylistUpdate);
                return responsePlaylistUpdate;
            }
            else {
                throw new RuntimeException("Creation playlist error");
            }
        }
        catch (Exception e){
            System.out.println(e);
            throw new RuntimeException("Creation playlist error");

        }
    }

    @Override
    public ResponsePlaylistItem updateItemPlaylist(UserEntity user, List<String> tracksUri, String playlistId, String snapshotId, int rangeStart, int rangeLength, int insertBefore) {
        String accessToken = getSpotifyAccessToken(user);
        if(user.getSpotifyUser().getSpotifyId()==null) throw new NoSpotifyConnectionException(user.getId());
        ResponsePlaylistItem responsePlaylistUpdate = null;
        boolean doRequest = true;
        try {
            int offset = 0;
            final int limit = 100;
            while(doRequest) {
                ResponseEntity<String> responseUpdate;
                if(offset==0) {
                    responseUpdate = prepareUpdateItemPlaylistRequest(
                            SPOTIFY_URL + "playlists/" + playlistId + "/tracks", accessToken, new SpotifyPlaylistItemUpdate(tracksUri.subList(0, Math.min(tracksUri.size(), (offset + 1) * limit))));
                }
                else{
                    responseUpdate = prepareAddItemPlaylistRequest(
                            SPOTIFY_URL + "playlists/" + playlistId + "/tracks", accessToken, new SpotifyPlaylistItemAdd(tracksUri.subList(offset * limit, Math.min(tracksUri.size(), (offset + 1) * limit)),Math.min(tracksUri.size(), offset * limit)));
                }
                if (responseUpdate.getStatusCode() == HttpStatus.CREATED) {
                    responsePlaylistUpdate = objectMapper.readValue(responseUpdate.getBody(), ResponsePlaylistItem.class);
                    System.out.println(responsePlaylistUpdate);
                    offset++;
                }
                else {
                    throw new RuntimeException("Creation playlist error");
                }
                System.out.println(tracksUri.size());
                doRequest = tracksUri.size()>(offset*limit);
            }

        }catch (Exception e){
            System.out.println(e);
            throw new RuntimeException("Creation playlist error");

        }
        
        return responsePlaylistUpdate;

    }


    @Override
    public SpotifyUser getUser(UserEntity user) {
        String accessToken = getSpotifyAccessToken(user);
        try {
            ResponseEntity<String> response = prepareGetRequest(SPOTIFY_URL + "me", accessToken);
            return objectMapper.readValue(response.getBody(), SpotifyUser.class);
        }
        catch (Exception e){

        }
        return null;

    }

    @Override
    public SpotifyPlaylist createPlaylist(String name, UserEntity user, PlaylistEntity playlistEntity, String description){
        String accessToken = getSpotifyAccessToken(user);
        if(playlistEntity!=null) {
            SpotifyPlaylist checkExisting = checkExistingUserPlaylist(accessToken, playlistEntity);
            if (checkExisting != null && checkExisting.getId().equals(playlistEntity.getSpotifyPlaylistEmbedded().getSpotifyPlaylistId())) {
                ResponseEntity<String> responseCreation = prepareUpdatePlaylistInfoRequest(SPOTIFY_URL + "playlists/" + playlistEntity.getSpotifyPlaylistEmbedded().getSpotifyPlaylistId(), accessToken, new SpotifyPlaylistCreation(name, false, false, description));
                if (responseCreation.getStatusCode() == HttpStatus.OK) {
                    return checkExisting;
                }
                throw new RuntimeException("info non mises a jour");
            }
        }
        ResponseEntity<String> responseCreation = preparePostCreatePlaylistRequest(SPOTIFY_URL + "users/" + user.getSpotifyUser().getSpotifyId() + "/playlists", accessToken, new SpotifyPlaylistCreation(name, false, false, description));
        try {
            return objectMapper.readValue(responseCreation.getBody(), SpotifyPlaylist.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("Error playlist creation");
    }

    private SpotifyPlaylist checkExistingUserPlaylist(String accessToken, PlaylistEntity playlistEntity){
        if(playlistEntity.getSpotifyPlaylistEmbedded().getUri()!=null) {
            ResponseEntity<String> responseIsPlaylistExisting = prepareGetRequest(SPOTIFY_URL + "me/playlists?limit=50", accessToken);
            if (responseIsPlaylistExisting.getStatusCode() == HttpStatus.OK) {
                try {
                    SpotifyPaginationPlaylists spotifyPaginationPlaylists = objectMapper.readValue(responseIsPlaylistExisting.getBody(), SpotifyPaginationPlaylists.class);
                    for(SpotifyPlaylist sp : spotifyPaginationPlaylists.getItems()) {
                        if(sp.getUri().equals(playlistEntity.getSpotifyPlaylistEmbedded().getUri())){
                            return sp;
                        }
                    }
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    private ResponseEntity<String> prepareGetRequest(String url, String accessToken){
        HttpEntity<String> request = new HttpEntity<>(getHttpHeader(accessToken));
        return this.restTemplate.exchange(url, HttpMethod.GET, request, String.class);
    }

    private ResponseEntity<String> preparePostCreatePlaylistRequest(String url, String accessToken, SpotifyPlaylistCreation spotifyPlaylistCreation){
        HttpEntity<SpotifyPlaylistCreation> request = new HttpEntity<SpotifyPlaylistCreation>(spotifyPlaylistCreation,getHttpHeader(accessToken));
        return this.restTemplate.exchange(url, HttpMethod.POST, request, String.class);
    }

    private ResponseEntity<String> prepareUpdatePlaylistInfoRequest(String url, String accessToken, SpotifyPlaylistCreation spotifyPlaylistCreation){
        HttpEntity<SpotifyPlaylistCreation> request = new HttpEntity<SpotifyPlaylistCreation>(spotifyPlaylistCreation,getHttpHeader(accessToken));
        return this.restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
    }

    private ResponseEntity<String> prepareAddItemPlaylistRequest(String url, String accessToken, SpotifyPlaylistItemAdd spotifyPlaylistItemUpdate){
        HttpEntity<SpotifyPlaylistItemAdd> request = new HttpEntity<SpotifyPlaylistItemAdd>(spotifyPlaylistItemUpdate,getHttpHeader(accessToken));
        return this.restTemplate.exchange(url, HttpMethod.POST, request, String.class);
    }

    private ResponseEntity<String> prepareUpdateItemPlaylistRequest(String url, String accessToken, SpotifyPlaylistItemUpdate spotifyPlaylistItemUpdate){
        HttpEntity<SpotifyPlaylistItemUpdate> request = new HttpEntity<SpotifyPlaylistItemUpdate>(spotifyPlaylistItemUpdate,getHttpHeader(accessToken));
        return this.restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
    }

    private ResponseEntity<String> prepareDeleteItemPlaylistRequest(String url, String accessToken, SpotifyPlaylistItemDelete spotifyPlaylistItemDelete){
        HttpEntity<SpotifyPlaylistItemDelete> request = new HttpEntity<SpotifyPlaylistItemDelete>(spotifyPlaylistItemDelete,getHttpHeader(accessToken));
        return this.restTemplate.exchange(url, HttpMethod.DELETE, request, String.class);
    }

    private boolean isAccessTokenValid(Timestamp timestamp, int expireIn){
        if(timestamp==null)return false;
        LocalDateTime now = LocalDateTime.now();
        System.out.println(now);
        System.out.println(timestamp.toLocalDateTime().plus(Duration.ofSeconds(expireIn)));
        return timestamp.toLocalDateTime().plus(Duration.ofSeconds(expireIn)).isAfter(now);
    }

    private String getSpotifyAccessToken(UserEntity user){
        if(isAccessTokenValid(user.getSpotifyUser().getTokenCreation(), user.getSpotifyUser().getExpiresIn())){
            return user.getSpotifyUser().getSpotifyAccessToken();
        }
        else{
            System.out.println("PAS TOKEN OK");
            return ISpotifyAccountAPI.refreshToken(user);
        }
    }

    private HttpHeaders getHttpHeader(String accessToken){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer "+accessToken);
        headers.set("Accept", "application/json");
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
