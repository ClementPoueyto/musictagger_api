package com.mencelt.musictag.components;

import com.mencelt.musictag.apierror.exceptions.EmptyPlaylistGenerationException;
import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.MissingFieldException;
import com.mencelt.musictag.dto.dtomapping.TrackMapper;
import com.mencelt.musictag.dto.dtomapping.UserMapper;
import com.mencelt.musictag.dto.tags.TagDto;
import com.mencelt.musictag.dto.tracks.SpotifyTrackEmbeddedDto;
import com.mencelt.musictag.dto.tracks.TrackDto;
import com.mencelt.musictag.dto.users.SpotifyUserForm;
import com.mencelt.musictag.dto.users.UserDto;
import com.mencelt.musictag.dto.users.UserForm;
import com.mencelt.musictag.entities.*;
import com.mencelt.musictag.repository.UserRepository;
import com.mencelt.musictag.spotify.ISpotifyAPI;
import com.mencelt.musictag.spotify.dto.ResponsePlaylistItem;
import com.mencelt.musictag.spotify.dto.SpotifyLike;
import com.mencelt.musictag.spotify.dto.SpotifyPlaylist;
import com.mencelt.musictag.spotify.dto.SpotifyUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ITagService tagManager;

    @Autowired
    ITrackService trackManager;

    @Autowired
    IPlaylistService playlistManager;

    @Autowired
    ISpotifyAPI spotifyAPI;

    @Autowired
    UserMapper userMapper;

    @Autowired
    TrackMapper trackMapper;

    @Override
    public UserEntity getUserEntityBydId(String id) throws EntityNotFoundException {
        UserEntity user = userRepository.findUserEntityById(id);
        if(user==null){
            throw new EntityNotFoundException(UserEntity.class,"id", id);
        }
        return user;
    }

    @Override
    public UserDto getUserBydId(String id) throws EntityNotFoundException{
        return userMapper.toDto(getUserEntityBydId(id));
    }

    @Override
    public SpotifyUserEmbedded getSpotifyUserBydId(String id) throws EntityNotFoundException{
        UserEntity user = userRepository.findUserEntityById(id);
        if(user==null){
            throw new EntityNotFoundException(UserEntity.class,"id", id);
        }
        if(user.getSpotifyUser()==null){
            throw new EntityNotFoundException(SpotifyUser.class,"id", id);
        }
        return user.getSpotifyUser();    }

    @Override
    public UserDto createUser(UserForm user) {
        if(user.getId()==null){
            throw new MissingFieldException(UserForm.class, "id");
        }
        else{
            System.out.println(user);
            UserEntity existing = userRepository.findUserEntityById(user.getId());

            if (existing != null) {
                return userMapper.toDto(existing);
            }
            else {
                UserEntity newUser = new UserEntity(user);
                userRepository.save(newUser);
                return userMapper.toDto(newUser);
            }
        }
    }

    @Override
    public SpotifyUserEmbedded connectToSpotify(String id, SpotifyUserForm userForm) throws EntityNotFoundException{
        UserEntity user = this.userRepository.findUserEntityById(id);
        if(user==null) throw new EntityNotFoundException(UserEntity.class, "id", id);

        SpotifyUserEmbedded spotifyUserEmbedded = new SpotifyUserEmbedded();
        spotifyUserEmbedded.setSpotifyAccessToken(userForm.getAccessToken());
        spotifyUserEmbedded.setExpiresIn(userForm.getExpiresIn());
        spotifyUserEmbedded.setSpotifyRefreshToken(userForm.getRefreshToken());
        user.setSpotifyUser(spotifyUserEmbedded);
        SpotifyUser spotifyUserProfile = spotifyAPI.getUser(user);
        user.getSpotifyUser().setSpotifyId(spotifyUserProfile.id);
        this.userRepository.save(user);
        System.out.println(spotifyUserEmbedded);
        this.spotifyAPI.importTracksFromSpotify(user);
        return spotifyUserEmbedded;
    }

    @Override
    public List<TrackDto> importTracksFromSpotify(String id) throws EntityNotFoundException{
        UserEntity user = getUserEntityBydId(id);
        List<SpotifyLike> spotifyLikes = spotifyAPI.importTracksFromSpotify(user);
        Map<TrackEntity, Timestamp> tracks = trackManager.importTrack(spotifyLikes);
        tagManager.generateTagFromImportedTracks(id, tracks);
        return tracks.keySet().stream().map(trackMapper::toDto).collect(Collectors.toList());
    }


    @Override
    public String generatePlaylist(String userId, List<String> tags) {
        UserEntity user = getUserEntityBydId(userId);
        List<TagDto> trackTagged = tagManager.getUserTags(userId, "", Integer.MAX_VALUE, 0, tags);
        PlaylistEntity playlistEntity = playlistManager.getPlaylist(userId);
        if(trackTagged.isEmpty()) throw new EmptyPlaylistGenerationException(tags);
        List<String> spotifyIdTracks = trackTagged.stream().map(TagDto::getTrack).map(TrackDto::getSpotifyTrack).map(SpotifyTrackEmbeddedDto::getUri).filter(Objects::nonNull).collect(Collectors.toList());
        System.out.println(spotifyIdTracks);
        SpotifyPlaylist playlist = spotifyAPI.createPlaylist("MusicTag",user,playlistEntity, "Playlist générée avec les tags : "+tags.toString());
        ResponsePlaylistItem responsePlaylistItem = spotifyAPI.updateItemPlaylist(user, spotifyIdTracks, playlist.getId(), playlist.getSnapshot_id(),0,1,0);
        playlist.setSnapshot_id(responsePlaylistItem.getSnapshot_id());
        playlistManager.create(playlist, trackTagged.stream().map(TagDto::getTrack).collect(Collectors.toSet()), userMapper.toDto(user));
        return playlist.getUri();

    }


}
