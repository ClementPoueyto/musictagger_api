package com.mencelt.musictag.spotify;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mencelt.musictag.component.IUserManager;
import com.mencelt.musictag.entities.SpotifyUserEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.spotify.account.ISpotifyAccountAPI;
import com.mencelt.musictag.spotify.dto.SpotifySearch;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;
import com.mencelt.musictag.spotify.dto.SpotifyRefreshToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
        String accessToken = getSpotifyAccessToken(user.getSpotifyUserEntity());
        ResponseEntity<String> response = prepareRequest(SPOTIFY_URL + "search?q=\" + query + \"&type=track",accessToken);
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

    private ResponseEntity<String> prepareRequest(String url, String accessToken){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", accessToken);
        headers.set("Accept", "application/json");
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(headers);
        return this.restTemplate.exchange(url, HttpMethod.GET, request, String.class);
    }

    private boolean isAccessTokenValid(Timestamp timestamp, int expireIn){
        LocalDateTime now = LocalDateTime.now();
        return timestamp.toLocalDateTime().plus(Duration.ofSeconds(expireIn)).isBefore(now);
    }

    private String getSpotifyAccessToken(SpotifyUserEntity spotifyUser){
        if(isAccessTokenValid(spotifyUser.getToken_creation(), spotifyUser.getExpires_in())){
            return spotifyUser.getSpotifyAccessToken();
        }
        else{
            return ISpotifyAccountAPI.refreshToken(spotifyUser);
        }
    }
}
