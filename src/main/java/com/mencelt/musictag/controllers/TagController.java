package com.mencelt.musictag.controllers;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.MissingFieldException;
import com.mencelt.musictag.apierror.exceptions.UnauthrorizedUserException;
import com.mencelt.musictag.components.ITagService;
import com.mencelt.musictag.dto.tags.TagDto;
import com.mencelt.musictag.dto.tags.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class TagController {

    @Autowired
    ITagService tagManager;

    @PostMapping(value = "/tags")
    public ResponseEntity addTag(Authentication authentication, @RequestBody TagForm tagForm) throws MissingServletRequestParameterException, UnauthrorizedUserException {
        if(tagForm.getTags()==null||tagForm.getTags().size()<1){
            throw new MissingFieldException(TagForm.class,"tags");
        }
        if(tagForm.getUserId()==null){
            throw new MissingFieldException(TagForm.class,"userId");
        }
        if(!authentication.getName().equals(tagForm.getUserId())){
            throw new UnauthrorizedUserException(tagForm.getUserId());
        }

        tagManager.addTag(tagForm);
        return new ResponseEntity(HttpStatus.CREATED);

    }

    @PutMapping(value = "/tags/{id}")
    public void updateTagsToTrack(Authentication authentication, @PathVariable long id, @RequestParam String userId , @RequestBody List<String> tagsName) throws EntityNotFoundException {
        if(!authentication.getName().equals(userId)){
            throw new UnauthrorizedUserException(userId);
        }
        tagManager.updateTagsToTrack(userId, id, tagsName);

    }


    @GetMapping(value = "/tags/{id}")
    public TagDto getTagById(@PathVariable long id) throws EntityNotFoundException {
        return tagManager.getTagById(id);
    }


    @GetMapping(value = "/tags")
    public List<TagDto> getUserTags(Authentication authentication, @RequestParam String userId, @RequestParam int page, @RequestParam String query, @RequestParam int limit, @RequestParam List<String> filters) throws EntityNotFoundException {
        if(!authentication.getName().equals(userId)){
            throw new UnauthrorizedUserException(userId);
        }
        System.out.println(filters);
        if(limit<1 || limit>50) limit = 50;
        return tagManager.getUserTags(userId,query, limit, page, filters);

    }

    @GetMapping(value = "/tags/names")
    public List<String> getUserTagsName(@RequestParam String userId) throws EntityNotFoundException {
       return tagManager.getUserTagsName(userId);
    }


}
