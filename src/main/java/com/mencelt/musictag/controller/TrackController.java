package com.mencelt.musictag.controller;
import com.mencelt.musictag.component.ITrackManager;
import com.mencelt.musictag.entities.TrackEntity;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class TrackController {

    @Autowired
    ITrackManager trackManager;



    @PostMapping (value = "/track")
    @ResponseBody
    public TrackEntity addTrack(@RequestBody TrackEntity query) throws RuntimeException {
        return trackManager.addTrack(query);

    }


    @GetMapping(value = "/track/{id}")
    @ResponseBody
    public TrackEntity getTrackById(@PathVariable long id) throws NotFoundException {
        return trackManager.getTrackById(id);
    }



}
