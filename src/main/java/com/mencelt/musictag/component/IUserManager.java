package com.mencelt.musictag.component;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.user.SpotifyUserForm;
import com.mencelt.musictag.dto.user.UserForm;
import com.mencelt.musictag.entities.SpotifyUserEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;

import java.util.List;

public interface IUserManager {

    public UserEntity getUserBydId(String id) throws EntityNotFoundException;

    public SpotifyUserEmbedded getSpotifyUserBydId(String id) throws EntityNotFoundException;

    public UserEntity createUser(UserForm user);

    public SpotifyUserEmbedded connectToSpotify(String id, SpotifyUserForm userForm) throws EntityNotFoundException;

    public List<TrackEntity> importTracksFromSpotify(String id) throws EntityNotFoundException;

    public UserEntity saveUser(UserEntity userEntity);

    public void generatePlaylist(String userId, List<String> tags) throws EntityNotFoundException;
}
