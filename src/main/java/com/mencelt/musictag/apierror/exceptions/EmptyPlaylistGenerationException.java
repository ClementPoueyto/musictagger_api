package com.mencelt.musictag.apierror.exceptions;

import java.util.List;

public class EmptyPlaylistGenerationException extends RuntimeException{

    public EmptyPlaylistGenerationException(List<String> tags) {
        super(EmptyPlaylistGenerationException.generateMessage(tags));
    }

    private static String generateMessage( List<String> tags) {
        return
                " Playlist with tags : " +
                tags.toString() + " is empty";
    }
}
