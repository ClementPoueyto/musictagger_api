package com.mencelt.musictag.component;

import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.dto.music.TagForm;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.TrackEntity;
import javassist.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.awt.print.Pageable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface ITagManager {

    public void addTag(TagForm tagForm);

    public TagEntity getTagById(long id) throws EntityNotFoundException;

    public void updateTagsToTrack( String userId, long tagId,List<String>tagsName) throws EntityNotFoundException;

    public List<TagEntity> getUserTags(String userId, String query, int limit, int page, List<String> filters);

    public List<String> getUserTagsName(String userId);

    public List<TagEntity> generateTagFromImportedTracks(String userId, Map<TrackEntity, Timestamp> tracks);
}
