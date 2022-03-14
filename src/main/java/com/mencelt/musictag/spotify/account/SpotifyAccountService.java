package com.mencelt.musictag.spotify.account;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mencelt.musictag.entities.SpotifyUserEntity;
import com.mencelt.musictag.repository.SpotifyUserRepository;
import com.mencelt.musictag.spotify.dto.SpotifyRefreshToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SpotifyAccountService implements ISpotifyAccountAPI {

    private final String SPOTIFY_ACCOUNT_URL = "https://accounts.spotify.com/api/";

    private final RestTemplate restTemplate = new RestTemplate();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    SpotifyUserRepository spotifyUserRepository;

    @Override
    public String refreshToken(SpotifyUserEntity spotifyUser) {
        ResponseEntity<String> response = prepareRequest(SPOTIFY_ACCOUNT_URL + "token", spotifyUser.getSpotifyAccessToken());
        try {
            SpotifyRefreshToken refreshedToken = objectMapper.readValue(response.getBody(), SpotifyRefreshToken.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                updateRefreshedToken(spotifyUser, refreshedToken);
                return refreshedToken.getAccess_token();
            } else {
                return null;
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public String InitializeRefreshToken(String accessToken, String userId) {
        return null;
    }

    private ResponseEntity<String> prepareRequest(String url, String accessToken){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", accessToken);
        headers.set("Accept", "application/json");
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(headers);
        return this.restTemplate.exchange(url, HttpMethod.GET, request, String.class);
    }

    private void updateRefreshedToken(SpotifyUserEntity spotifyUser, SpotifyRefreshToken spotifyRefreshToken){
        spotifyUser.setSpotifyAccessToken(spotifyRefreshToken.getAccess_token());
        spotifyUser.setExpires_in(spotifyRefreshToken.getExpires_in());
        this.spotifyUserRepository.save(spotifyUser);
    }
}
