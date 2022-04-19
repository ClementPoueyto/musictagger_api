package com.mencelt.musictag.spotify;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mencelt.musictag.component.IUserManager;
import com.mencelt.musictag.entities.UserEntity;
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

    @Autowired
    IUserManager userManager;

    @Override
    public List<SpotifyTrack> search(String query, String idUser) {
        UserEntity user = userManager.getUserBydId(idUser);
        String accessToken = getSpotifyAccessToken(user);
        ResponseEntity<String> response = prepareSearchRequest(SPOTIFY_URL + "search?q=\" + query + \"&type=track",accessToken);
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
    public List<SpotifyTrack> importTracksFromSpotify(String userId) {
        UserEntity user = userManager.getUserBydId(userId);
        String accessToken = getSpotifyAccessToken(user);
        List<SpotifyTrack> spotifyTracks = new ArrayList<>();
        boolean doRequest = true;
        try {
            int offset = 0;
            final int limit = 50;
            while(doRequest) {
                ResponseEntity<String> response = prepareSearchRequest(SPOTIFY_URL + "me/tracks?limit="+limit+"&offset="+offset, accessToken);
                Like likedTracks = objectMapper.readValue(response.getBody(), Like.class);
                if (response.getStatusCode() == HttpStatus.OK) {
                    spotifyTracks.addAll(likedTracks.getItems().stream().map(SpotifyLike::getTrack).collect(Collectors.toList()));
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

    private ResponseEntity<String> prepareSearchRequest(String url, String accessToken){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer "+accessToken);
        headers.set("Accept", "application/json");
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(headers);
        return this.restTemplate.exchange(url, HttpMethod.GET, request, String.class);
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
}
