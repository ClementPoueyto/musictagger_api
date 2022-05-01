package com.mencelt.musictag.controller;

import com.mencelt.musictag.component.IUserManager;
import com.mencelt.musictag.dto.user.SpotifyUserForm;
import com.mencelt.musictag.dto.user.UserForm;
import com.mencelt.musictag.entities.SpotifyUserEmbedded;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@Controller
public class UserController {

    @Autowired
    IUserManager userManager;

    @GetMapping(value = "/users/{id}")
    @ResponseBody
    public ResponseEntity<UserEntity> getUserById(@PathVariable String id) throws NotFoundException {
        ResponseEntity response;
        try{
            UserEntity user = userManager.getUserBydId(id);
            response = new ResponseEntity(user, HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        return response;
    }

    @PostMapping(value = "/users")
    @ResponseBody
    public ResponseEntity<UserEntity> createUser(@RequestBody UserForm userForm) {
        ResponseEntity<UserEntity> response;
        try{
            UserEntity user = userManager.createUser(userForm);
            response = new ResponseEntity(user,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    @PostMapping(value = "/users/{id}/spotify/connect")
    @ResponseBody
    public ResponseEntity<SpotifyUserEmbedded> connectToSpotify(@RequestBody SpotifyUserForm userForm, @PathVariable String id) {
        ResponseEntity<SpotifyUserEmbedded> response;
        try{
            SpotifyUserEmbedded user = userManager.connectToSpotify(id,userForm);
            response = new ResponseEntity(user,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    @GetMapping(value = "/users/{id}/spotify/import")
    @ResponseBody
    public ResponseEntity<List<TrackEntity>> exportTracksFromSpotify(@PathVariable String id) {
        ResponseEntity<List<TrackEntity>> response;
        try{
            List<TrackEntity> tracks = userManager.importTracksFromSpotify(id);
            response = new ResponseEntity(tracks,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    @PostMapping (value = "/users/{id}/spotify/playlists")
    @ResponseBody
    public ResponseEntity generateSpotifyPlaylist(@PathVariable String id, @RequestBody List<String> tags ) {
        ResponseEntity response;
        try{
            userManager.generatePlaylist(id, tags);
            response = new ResponseEntity(HttpStatus.CREATED);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }
}
