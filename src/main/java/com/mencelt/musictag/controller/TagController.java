package com.mencelt.musictag.controller;

import com.mencelt.musictag.component.ITagManager;
import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class TagController {

    @Autowired
    ITagManager tagManager;

    @PostMapping(value = "/tags")
    @ResponseBody
    public ResponseEntity addTag(@RequestBody TagForm tagForm) {
            System.out.println(tagForm);
            ResponseEntity response;
            try{
                tagManager.addTag(tagForm);
                response = new ResponseEntity(HttpStatus.OK);
            }
            catch (RuntimeException e){
                response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
            }
            return response;
    }

    @PostMapping(value = "/tags/{id}")
    @ResponseBody
    public ResponseEntity updateTagsToTrack(@PathVariable long id, @RequestParam String userId , @RequestBody List<String> tagsName) {
        ResponseEntity response;
        try{
            tagManager.updateTagsToTrack(userId, id, tagsName);
            response = new ResponseEntity(HttpStatus.OK);
        }
        catch (RuntimeException | NotFoundException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return response;
    }


    @GetMapping(value = "/tags/{id}")
    @ResponseBody
    public ResponseEntity<TagEntity> getTagById(@PathVariable long id) throws NotFoundException {
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


    @GetMapping(value = "/tags")
    @ResponseBody
    public ResponseEntity<List<TagEntity>> getUserTags(@RequestParam String userId, @RequestParam int page) throws NotFoundException {
        ResponseEntity response;
        try{
            List<TagEntity> tags = tagManager.getUserTag(userId, PageRequest.of(page,50,  Sort.by("id")) );
            response = new ResponseEntity(tags,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        return response;
    }

    @GetMapping(value = "/tags/names")
    @ResponseBody
    public ResponseEntity<List<String>> getUserTagsName(@RequestParam String userId) throws NotFoundException {
        ResponseEntity response;
        try{
            List<String> tagsName = tagManager.getUserTagsName(userId);
            response = new ResponseEntity(tagsName,HttpStatus.OK);
        }
        catch (RuntimeException e){
            response = new ResponseEntity(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        return response;
    }


}
