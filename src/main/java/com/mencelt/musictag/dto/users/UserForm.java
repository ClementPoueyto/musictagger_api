package com.mencelt.musictag.dto.users;

public class UserForm {

    private String id;


    public UserForm(String id) {
        this.id = id;

    }

    public UserForm() {
    }

    @Override
    public String toString() {
        return "UserForm{" +
                "id='" + id + '\'' +
                '}';
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

}
