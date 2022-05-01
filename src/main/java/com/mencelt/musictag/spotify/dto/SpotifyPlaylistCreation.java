package com.mencelt.musictag.spotify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SpotifyPlaylistCreation {

    private String name;

    @JsonProperty("public")
    private boolean publique;

    private boolean collaborative;

    private String description;

    public SpotifyPlaylistCreation(String name, boolean publique, boolean collaborative, String description) {
        this.name = name;
        this.publique = publique;
        this.collaborative = collaborative;
        this.description = description;
    }

    public SpotifyPlaylistCreation() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isPublique() {
        return publique;
    }

    public void setPublique(boolean publique) {
        this.publique = publique;
    }

    public boolean isCollaborative() {
        return collaborative;
    }

    public void setCollaborative(boolean collaborative) {
        this.collaborative = collaborative;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
