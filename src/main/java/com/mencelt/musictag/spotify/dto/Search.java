package com.mencelt.musictag.spotify.dto;

import java.util.List;

public class Search {
        public String href;
        public List<SpotifyTrack> items;
        public int limit;
        public String next;
        public int offset;
        public String previous;
        public int total;

        public Search() {
        }

        public List<SpotifyTrack> getItems() {
                return items;
        }

        public void setItems(List<SpotifyTrack> items) {
                this.items = items;
        }

        public int getLimit() {
                return limit;
        }

        public void setLimit(int limit) {
                this.limit = limit;
        }

        public String getNext() {
                return next;
        }

        public void setNext(String next) {
                this.next = next;
        }

        public int getOffset() {
                return offset;
        }

        public void setOffset(int offset) {
                this.offset = offset;
        }

        public String getPrevious() {
                return previous;
        }

        public void setPrevious(String previous) {
                this.previous = previous;
        }

        public int getTotal() {
                return total;
        }

        public void setTotal(int total) {
                this.total = total;
        }

        public String getHref() {
                return href;
        }

        public void setHref(String href) {
                this.href = href;
        }
}
