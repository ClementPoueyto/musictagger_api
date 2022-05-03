package com.mencelt.musictag.apierror.exceptions;

public class NoSpotifyConnectionException extends RuntimeException{

    public NoSpotifyConnectionException(String userId) {
        super(NoSpotifyConnectionException.generateMessage(userId));
    }

    private static String generateMessage( String userId) {
        return
                " User with id : " +
                userId +" is not connected to Spotify";
    }
}
