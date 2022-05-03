package com.mencelt.musictag.controller;

import com.google.api.gax.rpc.UnauthenticatedException;
import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.UnauthrorizedUserException;
import com.mencelt.musictag.component.IUserManager;
import com.mencelt.musictag.dto.user.SpotifyUserForm;
import com.mencelt.musictag.dto.user.UserForm;
import com.mencelt.musictag.entities.SpotifyUserEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    IUserManager userManager;

    @GetMapping(value = "/users/{id}")
    @ResponseBody
    public UserEntity getUserById(Authentication authentication, @PathVariable String id) throws EntityNotFoundException {
        if(!authentication.getName().equals(id)){
            throw new UnauthrorizedUserException(id);
        }
        return userManager.getUserBydId(id);
    }

    @PostMapping(value = "/users")
    @ResponseBody
    public UserEntity createUser(Authentication authentication, @RequestBody UserForm userForm) {
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
    public List<TrackEntity> exportTracksFromSpotify(Authentication authentication,@PathVariable String id) throws EntityNotFoundException{
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
