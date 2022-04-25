package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import javassist.NotFoundException;
import org.springframework.data.domain.PageRequest;

import java.awt.print.Pageable;
import java.util.List;

public interface ITagManager {

    public void addTag(TagForm tagForm) throws RuntimeException;

    public TagEntity getTagById(long id) throws NotFoundException;

    public void updateTagsToTrack( String userId, long tagId,List<String>tagsName) throws NotFoundException;

    public List<TagEntity> getUserTags(String userId, String query, int limit, int page, List<String> filters) throws NotFoundException;

    public List<String> getUserTagsName(String userId) throws NotFoundException;

}
