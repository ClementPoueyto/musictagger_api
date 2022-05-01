package com.mencelt.musictag.spotify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class SpotifyPlaylist {

        public boolean collaborative;
        public String description;
        public ExternalUrls external_urls;
        public Followers followers;
        public String href;
        public String id;
        public List<Image> images;
        public String name;
        public Owner owner;
        @JsonProperty("public")
        public boolean mypublic;
        public String snapshot_id;
        public Search tracks;
        public String type;
        public String uri;
        public String primary_color;
        public SpotifyPlaylist() {
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

        public ExternalUrls getExternal_urls() {
                return external_urls;
        }

        public void setExternal_urls(ExternalUrls external_urls) {
                this.external_urls = external_urls;
        }

        public Followers getFollowers() {
                return followers;
        }

        public void setFollowers(Followers followers) {
                this.followers = followers;
        }

        public String getHref() {
                return href;
        }

        public void setHref(String href) {
                this.href = href;
        }

        public String getId() {
                return id;
        }

        public void setId(String id) {
                this.id = id;
        }

        public List<Image> getImages() {
                return images;
        }

        public void setImages(List<Image> images) {
                this.images = images;
        }

        public String getName() {
                return name;
        }

        public void setName(String name) {
                this.name = name;
        }

        public Owner getOwner() {
                return owner;
        }

        public void setOwner(Owner owner) {
                this.owner = owner;
        }

        public boolean isMypublic() {
                return mypublic;
        }

        public void setMypublic(boolean mypublic) {
                this.mypublic = mypublic;
        }

        public String getSnapshot_id() {
                return snapshot_id;
        }

        public void setSnapshot_id(String snapshot_id) {
                this.snapshot_id = snapshot_id;
        }

        public Search getTracks() {
                return tracks;
        }

        public void setTracks(Search tracks) {
                this.tracks = tracks;
        }

        public String getType() {
                return type;
        }

        public void setType(String type) {
                this.type = type;
        }

        public String getUri() {
                return uri;
        }

        public void setUri(String uri) {
                this.uri = uri;
        }

        public String getPrimary_color() {
                return primary_color;
        }

        public void setPrimary_color(String primary_color) {
                this.primary_color = primary_color;
        }
}
