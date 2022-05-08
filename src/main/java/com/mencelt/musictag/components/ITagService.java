package com.mencelt.musictag.components;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.tags.TagDto;
import com.mencelt.musictag.dto.tags.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface ITagService {

    public void addTag(TagForm tagForm);

    public TagDto getTagById(long id) throws EntityNotFoundException;

    public void updateTagsToTrack( String userId, long tagId,List<String>tagsName) throws EntityNotFoundException;

    public List<TagDto> getUserTags(String userId, String query, int limit, int page, List<String> filters);

    public List<String> getUserTagsName(String userId);

    public List<TagEntity> generateTagFromImportedTracks(String userId, Map<TrackEntity, Timestamp> tracks);
}
