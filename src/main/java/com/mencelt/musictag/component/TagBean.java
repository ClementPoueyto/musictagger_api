package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.repository.TagRepository;
import com.mencelt.musictag.repository.specifications.TagSpecification;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class TagBean implements ITagManager {

    @Autowired
    private ITrackManager trackService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private TagSpecification tagSpecification;

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
                existing = new TagEntity(new HashSet(),trackEntity, tagForm.getUserId());
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
    public void updateTagsToTrack( String userId, long tagId,List<String>tagsName) throws NotFoundException {
        TagEntity tagExisting = tagRepository.findTagEntityById(tagId);
        if(tagsName.size()>0){
            tagsName = tagsName.stream().filter((tag)-> !tag.trim().equals("")).collect(Collectors.toList());
            if(tagExisting==null){
                throw new RuntimeException("track not found with id : "+tagId);
            }
            tagExisting.setTags(new HashSet<>(tagsName));
            tagRepository.save(tagExisting);
        }
        else{
            tagRepository.delete(tagExisting);
        }


    }



    @Override
    public List<TagEntity> getUserTags(String userId, String query, int limit, int page) throws NotFoundException {
        if(limit<1 || limit>50) limit = 50;
        List<TagEntity> tags;
        query = query.replaceAll("\"","");
        query = query.replaceAll("'","");
        if(query.trim().length() == 0){
           tags = tagRepository.findTagEntitiesByUserId(userId, PageRequest.of(page,limit,  Sort.by(Sort.Direction.DESC,"addedAt")));
        }
        else{
            tags = tagRepository.findAll(tagSpecification.searchTags(userId, query), PageRequest.of(page,limit, Sort.by(Sort.Direction.DESC,"addedAt"))).toList();
        }
        return tags;
    }

    @Override
    public List<String> getUserTagsName(String userId) throws NotFoundException {
        List<TagEntity> tags = tagRepository.findTagEntitiesByUserId(userId);
        return tags.stream().flatMap(e -> e.getTags().stream()).distinct().collect(Collectors.toList());
    }




}
