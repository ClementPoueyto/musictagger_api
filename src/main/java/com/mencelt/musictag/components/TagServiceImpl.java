package com.mencelt.musictag.components;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.dtomapping.TagMapper;
import com.mencelt.musictag.dto.tags.TagDto;
import com.mencelt.musictag.dto.tags.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.repository.TagRepository;
import com.mencelt.musictag.repository.specifications.TagSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements ITagService {

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private ITrackService trackService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private TagSpecification tagSpecification;

    @Override
    public void addTag(TagForm tagForm) {


            TrackEntity trackEntity = null;
            List<String> tagNames = tagForm.getTags();
            tagNames = tagNames.stream().filter((tag)-> !tag.trim().equals("")).collect(Collectors.toList());
            tagNames.replaceAll(x->x.replaceAll("\"",""));
            tagNames.replaceAll(x->x.replaceAll("\"",""));
            tagNames.replaceAll(x->x.replaceAll(",",""));

            trackEntity = trackService.getTrackEntityById(tagForm.getTrackId());

            if(trackEntity==null) throw new EntityNotFoundException(TrackEntity.class, "id", String.valueOf(tagForm.getTrackId()));
            TagEntity existing = tagRepository.findTagEntityByUserIdAndTrack(tagForm.getUserId(), trackEntity);
            if (existing == null) {
                existing = new TagEntity(new HashSet(),trackEntity, tagForm.getUserId());
            }
            for(String name : tagNames){
                existing.getTags().add(name);
            }
            tagRepository.save(existing);


    }

    @Override
    public TagDto getTagById(long id) throws EntityNotFoundException {
        TagEntity tag = tagRepository.findTagEntityById(id);
        if(tag==null){
            throw new EntityNotFoundException(TagEntity.class, "id", String.valueOf(id));
        }
        return tagMapper.toDto(tag);
    }

    @Override
    public void updateTagsToTrack( String userId, long tagId,List<String>tagsName) throws EntityNotFoundException {
        TagEntity tagExisting = tagRepository.findTagEntityById(tagId);
        if(tagsName.size()>0){
            tagsName = tagsName.stream().filter((tag)-> !tag.trim().equals("")).collect(Collectors.toList());
            tagsName.replaceAll(x->x.replaceAll("\"",""));
            tagsName.replaceAll(x->x.replaceAll("\"",""));
            tagsName.replaceAll(x->x.replaceAll(",",""));

            if(tagExisting==null){
                throw new EntityNotFoundException(TagEntity.class, "id" , String.valueOf(tagId));
            }
            tagExisting.setTags(new HashSet<>(tagsName));
            tagRepository.save(tagExisting);
        }
        else{
            tagRepository.delete(tagExisting);
        }


    }



    @Override
    public List<TagDto> getUserTags(String userId, String query, int limit, int page, List<String> filters) {
        List<TagEntity> tags;
        query = query.replaceAll("\"","");
        query = query.replaceAll("'","");

        filters.replaceAll(x->x.replaceAll("\"",""));
        filters.replaceAll(x->x.replaceAll("'",""));

        filters = filters.stream().filter((e)-> e.trim().length()>0).collect(Collectors.toList());

        if(query.trim().length() == 0 && filters.size()==0){
           tags = tagRepository.findTagEntitiesByUserId(userId, PageRequest.of(page,limit,  Sort.by(Sort.Direction.DESC,"addedAt")));
        }
        else{
            tags = tagRepository.findAll(tagSpecification.searchTags(userId, query, filters), PageRequest.of(page,limit, Sort.by(Sort.Direction.DESC,"addedAt"))).toList();
        }
        return tags.stream().map(tagMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<String> getUserTagsName(String userId) {
        List<TagEntity> tags = tagRepository.findTagEntitiesByUserId(userId);
        return tags.stream().flatMap(e -> e.getTags().stream()).distinct().collect(Collectors.toList());
    }

    @Override
    public List<TagEntity> generateTagFromImportedTracks(String id, Map<TrackEntity, Timestamp> tracks) {
        List<TagEntity> tags = new ArrayList<>();
        tracks.forEach((key, value) -> {
            TagEntity tagEntity = tagRepository.findTagEntityByUserIdAndTrack(id, key);
            if (tagEntity == null) {
                tagEntity = new TagEntity(new HashSet<>(), key, id);
            }
            tagEntity.getTags().add("like");
            tagEntity.setAddedAt(value);
            tags.add(tagEntity);
        });

        List<TagEntity> myTags = tagRepository.findTagEntitiesByUserId(id);
        List<TagEntity> toDelete = new ArrayList<>();
        myTags.forEach((e)->{
            if(!tags.contains(e)){
                e.getTags().remove("like");
                if(e.getTags().size()==0){
                    toDelete.add(e);
                }
                tags.add(e);
            }
        });
        tagRepository.saveAll(tags);
        tagRepository.deleteAll(toDelete);

        return tags;
    }



}
