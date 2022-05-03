package com.mencelt.musictag.apierror.exceptions;

import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

public class MissingFieldException extends RuntimeException{

    public MissingFieldException(Class clazz, String... searchParamsMap) {
        super(MissingFieldException.generateMessage(clazz.getSimpleName(),Arrays.asList(searchParamsMap)));
    }

    private static String generateMessage(String entity,List<String> searchParams) {
        return
                " parameters : " +
                searchParams +" are non null field"+
                        ((searchParams.size()>1)?"s":"") +" in "+StringUtils.capitalize(entity);
    }

}
