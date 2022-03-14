package com.mencelt.musictag.controller;

import com.mencelt.musictag.component.ITagManager;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.model.music.TagForm;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class TagController {

    @Autowired
    ITagManager tagManager;

    @PostMapping(value = "/tag")
    @ResponseBody
    public ResponseEntity<TagEntity> addTag(@RequestBody TagForm tagForm) {
            System.out.println(tagForm);
            ResponseEntity<TagEntity> response;
            try{
                TagEntity tag = tagManager.addTag(tagForm);
                response = new ResponseEntity(tag,HttpStatus.OK);
            }
            catch (RuntimeException e){
                response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
            }
            return response;
    }

    @PostMapping(value = "/tag/track/{trackId}")
    @ResponseBody
    public ResponseEntity<TagEntity> addTagToTrack(@PathVariable Long trackId, @RequestBody List<Long> tagIds) {
        ResponseEntity<TagEntity> response;
        try{
            List<TagEntity> tags = tagManager.addTagsToTrack(trackId, tagIds);
            response = new ResponseEntity(tags,HttpStatus.OK);
        }
        catch (RuntimeException | NotFoundException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    /*@PostMapping(value = "/tag/user/{userId}")
    @ResponseBody
    public ResponseEntity<TagEntity> addTagToUser(@PathVariable String userId, @RequestBody List<TagForm> tags) {
        ResponseEntity<TagEntity> response;
        try{
            List<TagEntity> tags = tagManager.addTagToUser(userId, tagIds);
            response = new ResponseEntity(tags,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }*/

    @GetMapping(value = "/tag")
    @ResponseBody
    public ResponseEntity<TagEntity> getTagById(@RequestParam long id) throws NotFoundException {
        ResponseEntity response;
        try{
            TagEntity tag = tagManager.getTagById(id);
            response = new ResponseEntity(tag,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        return response;
    }
}
