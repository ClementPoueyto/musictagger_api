package com.mencelt.musictag.dto.dtomapping;

import com.mencelt.musictag.entities.TrackEntity;
import com.mencelt.musictag.spotify.dto.SpotifyTrack;

public interface IMapper<E,D> {

        D toDto(E entity);

        E toEntity(D dto);


}
