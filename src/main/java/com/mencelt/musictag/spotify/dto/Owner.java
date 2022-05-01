package com.mencelt.musictag.spotify.dto;

public class Owner{
    public ExternalUrls external_urls;
    public Followers followers;
    public String href;
    public String id;
    public String type;
    public String uri;
    public String display_name;

    public Owner() {
    }

    public Owner(ExternalUrls external_urls, Followers followers, String href, String id, String type, String uri, String display_name) {
        this.external_urls = external_urls;
        this.followers = followers;
        this.href = href;
        this.id = id;
        this.type = type;
        this.uri = uri;
        this.display_name = display_name;
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

    public String getDisplay_name() {
        return display_name;
    }

    public void setDisplay_name(String display_name) {
        this.display_name = display_name;
    }
}