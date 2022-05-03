package com.mencelt.musictag.apierror.exceptions;

import org.springframework.util.StringUtils;

import java.util.Map;

public class UnauthrorizedUserException extends RuntimeException{

    public UnauthrorizedUserException( String userId) {
        super(UnauthrorizedUserException.generateMessage(userId));
    }

    private static String generateMessage( String userId) {
        return
                " Forbidden action to user : " +
                userId;
    }
}
