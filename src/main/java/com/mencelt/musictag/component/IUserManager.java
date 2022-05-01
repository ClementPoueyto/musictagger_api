package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.user.SpotifyUserForm;
import com.mencelt.musictag.dto.user.UserForm;
import com.mencelt.musictag.entities.SpotifyUserEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;

import java.util.List;

public interface IUserManager {

    public UserEntity getUserBydId(String id);

    public SpotifyUserEmbedded getSpotifyUserBydId(String id);

    public UserEntity createUser(UserForm user);

    public SpotifyUserEmbedded connectToSpotify(String id, SpotifyUserForm userForm);

    public List<TrackEntity> importTracksFromSpotify(String id);

    public UserEntity saveUser(UserEntity userEntity);

    public void generatePlaylist(String userId, List<String> tags);
}
