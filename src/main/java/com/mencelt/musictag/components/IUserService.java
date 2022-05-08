package com.mencelt.musictag.components;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.dto.users.SpotifyUserForm;
import com.mencelt.musictag.dto.users.UserDto;
import com.mencelt.musictag.dto.users.UserForm;
import com.mencelt.musictag.entities.SpotifyUserEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;

import java.util.List;

public interface IUserService {

    public UserEntity getUserEntityBydId(String id) throws EntityNotFoundException;

    public UserDto getUserBydId(String id) throws EntityNotFoundException;

    public SpotifyUserEmbedded getSpotifyUserBydId(String id) throws EntityNotFoundException;

    public UserDto createUser(UserForm user);

    public SpotifyUserEmbedded connectToSpotify(String id, SpotifyUserForm userForm) throws EntityNotFoundException;

    public List<TrackDto> importTracksFromSpotify(String id) throws EntityNotFoundException;

    public void generatePlaylist(String userId, List<String> tags) throws EntityNotFoundException;
}
