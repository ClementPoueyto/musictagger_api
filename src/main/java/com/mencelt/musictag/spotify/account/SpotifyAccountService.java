package com.mencelt.musictag.spotify.account;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.MissingFieldException;
import com.mencelt.musictag.apierror.exceptions.NoSpotifyConnectionException;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.repository.UserRepository;
import com.mencelt.musictag.spotify.dto.SpotifyRefreshToken;
import com.mencelt.musictag.spotify.dto.SpotifyUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Base64;

@Component
public class SpotifyAccountService implements ISpotifyAccountAPI {

    @Value("${spring.spotify.client_id}")
    private String spotifyClientId;

    @Value("${spring.spotify.client_secret}")
    private String spotifyClientSecret;

    private final String SPOTIFY_ACCOUNT_URL = "https://accounts.spotify.com/api/";

    private final RestTemplate restTemplate = new RestTemplate();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    UserRepository userRepository;

    @Override
    public String refreshToken(UserEntity user) {
        if(user==null) throw new MissingFieldException(UserEntity.class, "user");
        if(user.getSpotifyUser()==null) throw new NoSpotifyConnectionException(user.getId());
        ResponseEntity<String> response = prepareRequest(SPOTIFY_ACCOUNT_URL + "token", user.getSpotifyUser().getSpotifyRefreshToken());
        try {
            SpotifyRefreshToken refreshedToken = objectMapper.readValue(response.getBody(), SpotifyRefreshToken.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                updateRefreshedToken(user, refreshedToken);
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

    private ResponseEntity<String> prepareRequest(String url, String refreshToken){
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.set("grant_type", "refresh_token");
        body.set("refresh_token", refreshToken);

        HttpHeaders headers = new HttpHeaders();
        String auth = spotifyClientId+":"+spotifyClientSecret;
        headers.set("Authorization", "Basic "+ Base64.getEncoder().encodeToString(auth.getBytes()));
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/x-www-form-urlencoded");
        HttpEntity<MultiValueMap<String,String>> request = new HttpEntity<MultiValueMap<String,String>>(body, headers);
        return this.restTemplate.exchange(url, HttpMethod.POST, request, String.class);
    }

    private void updateRefreshedToken(UserEntity user, SpotifyRefreshToken spotifyRefreshToken){
        user.getSpotifyUser().setSpotifyAccessToken(spotifyRefreshToken.getAccess_token());
        user.getSpotifyUser().setExpiresIn(spotifyRefreshToken.getExpires_in());
        user.getSpotifyUser().setTokenCreation(Timestamp.valueOf(LocalDateTime.now()));
        this.userRepository.save(user);
    }

}
