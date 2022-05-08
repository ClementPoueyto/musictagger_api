package com.mencelt.musictag.controllers;
import com.mencelt.musictag.components.ITrackService;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.entities.TrackEntity;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class TrackController {

    @Autowired
    ITrackService trackManager;



    @PostMapping (value = "/track")
    @ResponseBody
    public TrackDto addTrack(@RequestBody TrackEntity query) throws RuntimeException {
        return trackManager.addTrack(query);

    }


    @GetMapping(value = "/track/{id}")
    @ResponseBody
    public TrackDto getTrackById(@PathVariable long id) throws NotFoundException {
        return trackManager.getTrackById(id);
    }



}
