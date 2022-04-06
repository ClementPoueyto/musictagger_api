package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.user.SpotifyUserForm;
import com.mencelt.musictag.dto.user.UserForm;
import com.mencelt.musictag.entities.SpotifyUser;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserBean implements IUserManager{

    @Autowired
    UserRepository userRepository;


    @Override
    public UserEntity getUserBydId(String id) {
        UserEntity user = userRepository.findUserEntityById(id);
        if(user==null){
            throw new RuntimeException("user not found with id : "+id);
        }
        return user;    }

    @Override
    public SpotifyUser getSpotifyUserBydId(String id) {
        UserEntity user = userRepository.findUserEntityById(id);
        if(user==null){
            throw new RuntimeException("user not found with id : "+id);
        }
        if(user.getSpotifyUser()==null){
            throw new RuntimeException("spotify user not found");
        }
        return user.getSpotifyUser();    }

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
    public SpotifyUser connectToSpotify(String id, SpotifyUserForm userForm) {
        UserEntity user = this.userRepository.findUserEntityById(id);
        if(user==null) throw new RuntimeException("utilisateur inconnu");

        SpotifyUser spotifyUser = new SpotifyUser();
        spotifyUser.setSpotifyAccessToken(userForm.getAccessToken());
        spotifyUser.setExpiresIn(userForm.getExpiresIn());
        spotifyUser.setSpotifyRefreshToken(userForm.getRefreshToken());
        user.setSpotifyUser(spotifyUser);
        this.userRepository.save(user);
        System.out.println(spotifyUser);
        return spotifyUser;
    }

    @Override
    public UserEntity saveUser(UserEntity userEntity) {
        return userRepository.save(userEntity);
    }


}
