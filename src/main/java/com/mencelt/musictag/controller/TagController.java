package com.mencelt.musictag.controller;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.MissingFieldException;
import com.mencelt.musictag.apierror.exceptions.UnauthrorizedUserException;
import com.mencelt.musictag.component.ITagManager;
import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.util.List;

@Controller
public class TagController {

    @Autowired
    ITagManager tagManager;

    @PostMapping(value = "/tags")
    @ResponseBody
    public void addTag(Authentication authentication, @RequestBody TagForm tagForm) throws MissingServletRequestParameterException, UnauthrorizedUserException {
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

    }

    @PostMapping(value = "/tags/{id}")
    @ResponseBody
    public void updateTagsToTrack(Authentication authentication, @PathVariable long id, @RequestParam String userId , @RequestBody List<String> tagsName) throws EntityNotFoundException {
        if(!authentication.getName().equals(userId)){
            throw new UnauthrorizedUserException(userId);
        }
        tagManager.updateTagsToTrack(userId, id, tagsName);

    }


    @GetMapping(value = "/tags/{id}")
    @ResponseBody
    public TagEntity getTagById(@PathVariable long id) throws EntityNotFoundException {
        return tagManager.getTagById(id);
    }


    @GetMapping(value = "/tags")
    @ResponseBody
    public List<TagEntity> getUserTags(Authentication authentication, @RequestParam String userId, @RequestParam int page, @RequestParam String query, @RequestParam int limit, @RequestParam List<String> filters) throws EntityNotFoundException {
        if(!authentication.getName().equals(userId)){
            throw new UnauthrorizedUserException(userId);
        }
        System.out.println(filters);
        if(limit<1 || limit>50) limit = 50;
        return tagManager.getUserTags(userId,query, limit, page, filters);

    }

    @GetMapping(value = "/tags/names")
    @ResponseBody
    public List<String> getUserTagsName(@RequestParam String userId) throws EntityNotFoundException {
       return tagManager.getUserTagsName(userId);
    }


}
