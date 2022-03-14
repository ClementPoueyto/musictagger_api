package com.mencelt.musictag.controller;

import com.mencelt.musictag.component.IUserManager;
import com.mencelt.musictag.entities.SpotifyUserEntity;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.model.user.SpotifyUserForm;
import com.mencelt.musictag.model.user.UserForm;
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

    @GetMapping(value = "/user")
    @ResponseBody
    public ResponseEntity<UserEntity> getUserById(@RequestParam String id) throws NotFoundException {
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

    @PostMapping(value = "/user")
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

    @PostMapping(value = "/user/connect/spotify")
    @ResponseBody
    public ResponseEntity<SpotifyUserEntity> connectToSpotify(@RequestBody SpotifyUserForm userForm, @RequestParam String userId) {
        ResponseEntity<SpotifyUserEntity> response;
        try{
            SpotifyUserEntity user = userManager.connectToSpotify(userForm);
            response = new ResponseEntity(user,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }
}
