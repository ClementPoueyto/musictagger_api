package com.mencelt.musictag.component;

import com.mencelt.musictag.entities.SpotifyUserEntity;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.model.user.SpotifyUserForm;
import com.mencelt.musictag.model.user.UserForm;
import com.mencelt.musictag.repository.SpotifyUserRepository;
import com.mencelt.musictag.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;

@Component
public class UserBean implements IUserManager{

    @Autowired
    UserRepository userRepository;

    @Autowired
    SpotifyUserRepository spotifyUserRepository;

    @Override
    public UserEntity getUserBydId(String id) {
        UserEntity user = userRepository.findUserEntityById(id);
        if(user==null){
            throw new RuntimeException("user not found with id : "+id);
        }
        return user;    }

    @Override
    public SpotifyUserEntity getSpotifyUserBydId(String id) {
        SpotifyUserEntity user = spotifyUserRepository.findSpotifyUserEntityById(id);
        if(user==null){
            throw new RuntimeException("user not found with id : "+id);
        }
        return user;    }

    @Override
    public UserEntity createUser(UserForm user) {
        if(user.getId()==null){
            throw new RuntimeException("id is non null fields");
        }
        else{
            System.out.println(user);
            UserEntity existing = userRepository.findUserEntityById(user.getId());

            if (existing != null) {
                return existing;
            }
            else {
                UserEntity newUser = new UserEntity(user);
                userRepository.save(newUser);
                return newUser;
            }
        }
    }

    @Override
    public SpotifyUserEntity connectToSpotify(SpotifyUserForm userForm) {
        SpotifyUserEntity spotifyUserEntity = new SpotifyUserEntity();

        spotifyUserEntity.setSpotifyAccessToken(userForm.getAccess_token());
        spotifyUserEntity.setExpires_in(userForm.getExpires_in());
        spotifyUserEntity.setSpotifyRefreshToken(userForm.getRefresh_token());

        return null;
    }

    @Override
    public UserEntity saveUser(UserEntity userEntity) {
        return userRepository.save(userEntity);
    }


}
