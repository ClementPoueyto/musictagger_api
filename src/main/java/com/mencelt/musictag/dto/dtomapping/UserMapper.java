package com.mencelt.musictag.dto.dtomapping;

import com.mencelt.musictag.dto.tracks.SpotifyTrackEmbeddedDto;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.dto.users.SpotifyUserEmbeddedDto;
import com.mencelt.musictag.dto.users.UserDto;
import com.mencelt.musictag.entities.SpotifyTrackEmbedded;
import com.mencelt.musictag.entities.SpotifyUserEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper implements IMapper<UserEntity, UserDto> {

    @Override
    public UserDto toDto(UserEntity entity) {
        UserDto userDto = new UserDto();
        userDto.setId(entity.getId());
        userDto.setTagList(entity.getTagList());
        if(entity.getSpotifyUser()!=null){
            SpotifyUserEmbedded embedded = entity.getSpotifyUser();
            SpotifyUserEmbeddedDto spotifyUserEmbeddedDto = new SpotifyUserEmbeddedDto();
            spotifyUserEmbeddedDto.setSpotifyId(embedded.getSpotifyId());
            spotifyUserEmbeddedDto.setExpiresIn(embedded.getExpiresIn());
            spotifyUserEmbeddedDto.setSpotifyAccessToken(embedded.getSpotifyAccessToken());
            spotifyUserEmbeddedDto.setSpotifyRefreshToken(embedded.getSpotifyRefreshToken());
            spotifyUserEmbeddedDto.setTokenCreation(embedded.getTokenCreation());
            userDto.setSpotifyUserEmbedded(spotifyUserEmbeddedDto);

        }
        return userDto;
    }

    @Override
    public UserEntity toEntity(UserDto dto) {
        return null;
    }
}
