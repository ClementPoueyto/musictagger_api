package com.mencelt.musictag.controllers;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.UnauthrorizedUserException;
import com.mencelt.musictag.components.IUserService;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.dto.users.SpotifyUserForm;
import com.mencelt.musictag.dto.users.UserDto;
import com.mencelt.musictag.dto.users.UserForm;
import com.mencelt.musictag.entities.SpotifyUserEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
public class UserController {

    @Autowired
    IUserService userManager;

    @GetMapping(value = "/users/{id}")
    @ResponseBody
    public UserDto getUserById(Authentication authentication, @PathVariable String id) throws EntityNotFoundException {
        if(!authentication.getName().equals(id)){
            throw new UnauthrorizedUserException(id);
        }
        UserDto user;
        try{
           user = userManager.getUserBydId(id);
        }catch (EntityNotFoundException e){
            UserForm userForm = new UserForm();
            userForm.setId(id);
            user = createUser(authentication, userForm );
        }
        return user;
    }

    @PostMapping(value = "/users")
    @ResponseBody
    public UserDto createUser(Authentication authentication, @RequestBody UserForm userForm) {
        if(!authentication.getName().equals(userForm.getId())){
            throw new UnauthrorizedUserException(userForm.getId());
        }
        return userManager.createUser(userForm);

    }

    @PostMapping(value = "/users/{id}/spotify/connect")
    @ResponseBody
    public SpotifyUserEmbedded connectToSpotify(Authentication authentication,@RequestBody SpotifyUserForm userForm, @PathVariable String id) throws EntityNotFoundException{
        if(!authentication.getName().equals(id)){
            throw new UnauthrorizedUserException(id);
        }
        return userManager.connectToSpotify(id,userForm);

    }

    @GetMapping(value = "/users/{id}/spotify/import")
    @ResponseBody
    public List<TrackDto> exportTracksFromSpotify(Authentication authentication, @PathVariable String id) throws EntityNotFoundException{
        if(!authentication.getName().equals(id)){
            throw new UnauthrorizedUserException(id);
        }
        return userManager.importTracksFromSpotify(id);

    }

    @PutMapping (value = "/users/{id}/spotify/playlists")
    @ResponseBody
    public void generateSpotifyPlaylist(Authentication authentication, @PathVariable String id, @RequestBody List<String> tags ) throws EntityNotFoundException {
        if(!authentication.getName().equals(id)){
            throw new UnauthrorizedUserException(id);
        }
        userManager.generatePlaylist(id, tags);
    }
}
