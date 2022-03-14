package com.mencelt.musictag.component;

import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.model.music.TagForm;
import javassist.NotFoundException;

import java.util.List;

public interface ITagManager {

    public TagEntity addTag(TagForm tagForm) throws RuntimeException;

    public TagEntity getTagById(long id) throws NotFoundException;

    public List<TagEntity> addTagsToTrack(Long trackId, List<Long> tagIds) throws NotFoundException;

    public List<TagEntity> addTagToUser(String userId, List<Long> tagIdList);


}
