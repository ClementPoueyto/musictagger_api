package com.mencelt.musictag.spotify.dto;

public class ExplicitContent{
    public boolean filter_enabled;
    public boolean filter_locked;

    public ExplicitContent(boolean filter_enabled, boolean filter_locked) {
        this.filter_enabled = filter_enabled;
        this.filter_locked = filter_locked;
    }

    public ExplicitContent() {
    }

    public boolean isFilter_enabled() {
        return filter_enabled;
    }

    public void setFilter_enabled(boolean filter_enabled) {
        this.filter_enabled = filter_enabled;
    }

    public boolean isFilter_locked() {
        return filter_locked;
    }

    public void setFilter_locked(boolean filter_locked) {
        this.filter_locked = filter_locked;
    }
}
