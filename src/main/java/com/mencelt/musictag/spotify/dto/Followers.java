package com.mencelt.musictag.spotify.dto;

public class Followers{
    public String href;
    public int total;

    public Followers() {
    }

    public Followers(String href, int total) {
        this.href = href;
        this.total = total;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}


