package com.mencelt.musictag.controller;

import com.mencelt.musictag.spotify.ISpotifyAPI;
import com.mencelt.musictag.component.ITrackManager;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class TrackController {

    @Autowired
    ITrackManager trackManager;

    @Autowired
    ISpotifyAPI spotifyAPI;

    @GetMapping(value = "/search")
    @ResponseBody
    public List<SpotifyTrack> searchTrack(@RequestParam String query) {
        return spotifyAPI.search(query,"115974471533979611957");
    }

    @PostMapping (value = "/track")
    @ResponseBody
    public ResponseEntity<TrackEntity> addTrack(@RequestBody TrackEntity query) throws RuntimeException {
        ResponseEntity<TrackEntity> response;
        try{
            TrackEntity track = trackManager.addTrack(query);
            response = new ResponseEntity(track,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    /*@GetMapping(value = "/track")
    @ResponseBody
    public ResponseEntity<TrackEntity> getUserTracks(@RequestParam String userId) throws NotFoundException {
        ResponseEntity response;
        try{
            TrackEntity track = trackManager.getTrackById(userId);
            response = new ResponseEntity(track,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        return response;
    }*/


    @GetMapping(value = "/track/{id}")
    @ResponseBody
    public ResponseEntity<TrackEntity> getTrackById(@PathVariable long id) throws NotFoundException {
        ResponseEntity response;
        try{
            TrackEntity track = trackManager.getTrackById(id);
            response = new ResponseEntity(track,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        return response;
    }
}
