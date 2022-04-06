package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.entities.UserEntity;
import com.mencelt.musictag.repository.TagRepository;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Component
public class TagBean implements ITagManager {

    @Autowired
    ITrackManager trackService;

    @Autowired
    IUserManager userService;

    @Autowired
    TagRepository tagRepository;


    @Override
    public void addTag(TagForm tagForm) throws RuntimeException {
        if(tagForm.getName()==null||tagForm.getUserId()==null){
            throw new RuntimeException("name and userId are non null fields");
        }
        else{
            TagEntity tag = new TagEntity(tagForm.getName(), tagForm.getUserId());
            TagEntity existing = tagRepository.findTagEntityByUserIdAndName(tagForm.getUserId(), tagForm.getName());
            if (existing != null) {
                tag.setId(existing.getId());
            }
            List<TrackEntity> tracks = getTracksFromId(tagForm.getTracksId());
            tag.setTrackList(new HashSet<>(tracks));
            tagRepository.save(tag);
            List<Long> tagIdList = new ArrayList<>();
            tagIdList.add(323760L);
            addTagToUser(tagForm.getUserId(), tagIdList);
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
    public void addTagsToTrack(Long trackId, List<Long> tagIds) throws NotFoundException {
        if(trackId!=null) {
            TrackEntity track = trackService.getTrackById(trackId);

            List<TagEntity> tags = getTagsFromId(tagIds);
            for (TagEntity tag : tags) {
                if(!tag.getTrackList().contains(track)) {
                    tag.getTrackList().add(track);
                }
            }
            tagRepository.saveAll(tags);
        }
    }

    @Override
    public void addTagToUser(String userId, List<Long> tagIdList) {
        if(tagIdList==null||userId==null){
            throw new RuntimeException("tags and userId are non null fields");
        }
        else{
            UserEntity existing = userService.getUserBydId(userId);
            if (existing == null) {
                throw new RuntimeException("Unknown user");
            }
            else {
                List<TagEntity> tags = getTagsFromId(tagIdList);

                for(TagEntity tag : tags){
                    if(!existing.getTagList().contains(tag)){
                        existing.getTagList().add(tag);
                    }
                }

                userService.saveUser(existing);
            }
        }
    }

    @Override
    public List<TagEntity> getUserTag(String userId) throws NotFoundException {
        List<TagEntity> tags = tagRepository.findTagEntitiesByUserId(userId);
        return tags;
    }

    public List<TrackEntity> getTracksFromId(List<Long> ids){
        List<TrackEntity> tracks = new ArrayList<>();
           for(Long id : ids){
               try {
                   TrackEntity track = trackService.getTrackById(id);
                   if(track!=null){
                       tracks.add(track);
                   }
               } catch (Exception e) {
                   throw new RuntimeException(e.getMessage());
               }
           }

           return tracks;
    }
    public List<TagEntity> getTagsFromId(List<Long> ids){
        List<TagEntity> tags = new ArrayList<>();
        for(Long id : ids){
            try {
                TagEntity tag = getTagById(id);
                if(tag!=null){
                    tags.add(tag);
                }
            } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
            }
        }

        return tags;
    }
}
