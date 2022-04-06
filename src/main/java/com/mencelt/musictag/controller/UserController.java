package com.mencelt.musictag.controller;

import com.mencelt.musictag.component.IUserManager;
import com.mencelt.musictag.dto.user.SpotifyUserForm;
import com.mencelt.musictag.dto.user.UserForm;
import com.mencelt.musictag.entities.SpotifyUser;
import com.mencelt.musictag.entities.UserEntity;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<SpotifyUser> connectToSpotify(@RequestBody SpotifyUserForm userForm, @RequestParam String userId) {
        ResponseEntity<SpotifyUser> response;
        try{
            SpotifyUser user = userManager.connectToSpotify(userId,userForm);
            response = new ResponseEntity(user,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }
}
