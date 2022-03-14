package com.mencelt.musictag.model.user;

import javax.persistence.Column;
import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

public class UserForm {

    private String id;

    private String displayName;

    public UserForm(String id, String displayName) {
        this.id = id;
        this.displayName = displayName;

    }

    public UserForm() {
    }

    @Override
    public String toString() {
        return "UserForm{" +
                "id='" + id + '\'' +
                ", displayName='" + displayName + '\'' +
                '}';
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

}
