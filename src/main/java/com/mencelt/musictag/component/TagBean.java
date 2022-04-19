package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.repository.TagRepository;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class TagBean implements ITagManager {

    @Autowired
    ITrackManager trackService;

    @Autowired
    TagRepository tagRepository;


    @Override
    public void addTag(TagForm tagForm) throws RuntimeException {
    if(tagForm.getTags()==null||tagForm.getTags().size()<1||tagForm.getUserId()==null){
            throw new RuntimeException("name and userId and trackId are non null fields");
        }
        else{
            TrackEntity trackEntity = null;

            try {
                trackEntity = trackService.getTrackById(tagForm.getTrackId());
            } catch (NotFoundException e) {
                e.printStackTrace();
            }
            if(trackEntity==null) throw new RuntimeException("track not found");
            TagEntity existing = tagRepository.findTagEntityByUserIdAndTrack(tagForm.getUserId(), trackEntity);
            if (existing == null) {
                Set tags = new HashSet();
                existing = new TagEntity(tags,trackEntity, tagForm.getUserId());
            }
            for(String name : tagForm.getTags()){
                existing.getTags().add(name);
            }
            tagRepository.save(existing);
        }

    }

    @Override
    public TagEntity getTagById(long id) throws NotFoundException {
        TagEntity tag = tagRepository.findTagEntityById(id);
        if(tag==null){
            throw new RuntimeException("tag not found with id : "+id);
        }
        return tag;
    }

    @Override
    public void addTagsToTrack( String userId, long trackId,List<String>tagsName) throws NotFoundException {
        TrackEntity track = trackService.getTrackById(trackId);
        TagEntity tag = new TagEntity(new HashSet<>(tagsName), track, userId);
        tagRepository.save(tag);

    }


    @Override
    public List<TagEntity> getUserTag(String userId, PageRequest pageRequest) throws NotFoundException {
        List<TagEntity> tags = tagRepository.findTagEntitiesByUserId(userId, pageRequest);
        return tags;
    }

    @Override
    public List<String> getUserTagsName(String userId) throws NotFoundException {
        List<TagEntity> tags = tagRepository.findTagEntitiesByUserId(userId);
        Set<String> names = tags.stream().flatMap(e -> e.getTags().stream())
                .collect(Collectors.toSet());
        return new ArrayList<String>(names);
    }


}
