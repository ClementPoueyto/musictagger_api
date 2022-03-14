package com.mencelt.musictag.component;

import com.mencelt.musictag.entities.SpotifyUserEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.model.user.SpotifyUserForm;
import com.mencelt.musictag.model.user.UserForm;

import java.util.List;

public interface IUserManager {

    public UserEntity getUserBydId(String id);

    public SpotifyUserEntity getSpotifyUserBydId(String id);

    public UserEntity createUser(UserForm user);

    public SpotifyUserEntity connectToSpotify(SpotifyUserForm userForm);

    public UserEntity saveUser(UserEntity userEntity);
}
