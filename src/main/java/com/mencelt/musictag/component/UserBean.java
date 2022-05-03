package com.mencelt.musictag.component;

import com.mencelt.musictag.apierror.exceptions.EmptyPlaylistGenerationException;
import com.mencelt.musictag.apierror.exceptions.EntityNotFoundException;
import com.mencelt.musictag.apierror.exceptions.MissingFieldException;
import com.mencelt.musictag.dto.user.SpotifyUserForm;
import com.mencelt.musictag.dto.user.UserForm;
import com.mencelt.musictag.entities.*;
import com.mencelt.musictag.repository.UserRepository;
import com.mencelt.musictag.spotify.ISpotifyAPI;
import com.mencelt.musictag.spotify.dto.ResponsePlaylistItem;
import com.mencelt.musictag.spotify.dto.SpotifyLike;
import com.mencelt.musictag.spotify.dto.SpotifyPlaylist;
import com.mencelt.musictag.spotify.dto.SpotifyUser;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class UserBean implements IUserManager{

    @Autowired
    UserRepository userRepository;

    @Autowired
    ITagManager tagManager;

    @Autowired
    ITrackManager trackManager;

    @Autowired
    IPlaylistManager playlistManager;

    @Autowired
    ISpotifyAPI spotifyAPI;

    @Override
    public UserEntity getUserBydId(String id) throws EntityNotFoundException{
        UserEntity user = userRepository.findUserEntityById(id);
        if(user==null){
            throw new EntityNotFoundException(UserEntity.class,"id", id);
        }
        return user;
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
    public UserEntity createUser(UserForm user) {
        if(user.getId()==null){
            throw new MissingFieldException(UserForm.class, "id");
        }
        else{
            System.out.println(user);
            UserEntity existing = userRepository.findUserEntityById(user.getId());

            if (existing != null) {
                return existing;
            }
            else {
                UserEntity newUser = new UserEntity(user);
                userRepository.save(newUser);
                return newUser;
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
    public List<TrackEntity> importTracksFromSpotify(String id) throws EntityNotFoundException{
        UserEntity user = getUserBydId(id);
        List<SpotifyLike> spotifyLikes = spotifyAPI.importTracksFromSpotify(user);
        Map<TrackEntity, Timestamp> tracks = trackManager.importTrack(spotifyLikes);
        tagManager.generateTagFromImportedTracks(id, tracks);
        return new ArrayList<>(tracks.keySet());
    }

    @Override
    public UserEntity saveUser(UserEntity userEntity) {
        return userRepository.save(userEntity);
    }

    @Override
    public void generatePlaylist(String userId, List<String> tags) {
        UserEntity user = getUserBydId(userId);
        List<TagEntity> trackTagged = tagManager.getUserTags(userId, "", Integer.MAX_VALUE, 0, tags);
        PlaylistEntity playlistEntity = playlistManager.getPlaylist(userId);
        if(trackTagged.isEmpty()) throw new EmptyPlaylistGenerationException(tags);
        List<String> spotifyIdTracks = trackTagged.stream().map(TagEntity::getTrack).map(TrackEntity::getSpotifyTrack).map(SpotifyTrackEmbedded::getUri).collect(Collectors.toList());
        System.out.println(spotifyIdTracks);
        SpotifyPlaylist playlist = spotifyAPI.createPlaylist("MusicTag",user,playlistEntity, "Playlist générée avec les tags : "+tags.toString());
        ResponsePlaylistItem responsePlaylistItem = spotifyAPI.updateItemPlaylist(user, spotifyIdTracks, playlist.getId(), playlist.getSnapshot_id(),0,1,0);
        playlist.setSnapshot_id(responsePlaylistItem.getSnapshot_id());
        playlistManager.create(playlist, trackTagged.stream().map(TagEntity::getTrack).collect(Collectors.toSet()), user);


    }


}
