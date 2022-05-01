package com.mencelt.musictag.component;

import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import javassist.NotFoundException;
import org.springframework.data.domain.PageRequest;

import java.awt.print.Pageable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface ITagManager {

    public void addTag(TagForm tagForm) throws RuntimeException;

    public TagEntity getTagById(long id) throws NotFoundException;

    public void updateTagsToTrack( String userId, long tagId,List<String>tagsName) throws NotFoundException;

    public List<TagEntity> getUserTags(String userId, String query, int limit, int page, List<String> filters) throws NotFoundException;

    public List<String> getUserTagsName(String userId) throws NotFoundException;

    public List<TagEntity> generateTagFromImportedTracks(String userId, Map<TrackEntity, Timestamp> tracks);
}
