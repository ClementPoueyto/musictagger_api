package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.user.SpotifyUserForm;
import com.mencelt.musictag.dto.user.UserForm;
import com.mencelt.musictag.entities.SpotifyUser;
import com.mencelt.musictag.entities.UserEntity;

public interface IUserManager {

    public UserEntity getUserBydId(String id);

    public SpotifyUser getSpotifyUserBydId(String id);

    public UserEntity createUser(UserForm user);

    public SpotifyUser connectToSpotify(String id, SpotifyUserForm userForm);

    public UserEntity saveUser(UserEntity userEntity);
}
