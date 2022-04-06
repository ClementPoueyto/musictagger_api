package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import javassist.NotFoundException;

import java.util.List;

public interface ITagManager {

    public void addTag(TagForm tagForm) throws RuntimeException;

    public TagEntity getTagById(long id) throws NotFoundException;

    public void addTagsToTrack(Long trackId, List<Long> tagIds) throws NotFoundException;

    public void addTagToUser(String userId, List<Long> tagIdList);

    public List<TagEntity> getUserTag(String userId) throws NotFoundException;

}
