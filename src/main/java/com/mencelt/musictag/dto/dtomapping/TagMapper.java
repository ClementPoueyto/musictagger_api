package com.mencelt.musictag.dto.dtomapping;

import com.mencelt.musictag.dto.tags.TagDto;
import com.mencelt.musictag.dto.users.SpotifyUserEmbeddedDto;
import com.mencelt.musictag.dto.users.UserDto;
import com.mencelt.musictag.entities.SpotifyUserEmbedded;
import com.mencelt.musictag.entities.TagEntity;
import com.mencelt.musictag.entities.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TagMapper implements IMapper<TagEntity, TagDto> {


    @Autowired
    TrackMapper trackMapper;

    @Override
    public TagDto toDto(TagEntity entity) {
        TagDto tagDto = new TagDto();
        tagDto.setId(entity.getId());
        tagDto.setAddedAt(entity.getAddedAt());
        tagDto.setUserId(entity.getUserId());
        tagDto.setTags(entity.getTags());
        if(entity.getTrack()!=null) {
            tagDto.setTrack(trackMapper.toDto(entity.getTrack()));
        }
        return tagDto;
    }

    @Override
    public TagEntity toEntity(TagDto dto) {
        return null;
    }
}
