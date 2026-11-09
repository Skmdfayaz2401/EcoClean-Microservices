package com.ecoclean.notification.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private Long userId;
    private String userRole;
    private String title;
    private String message;
    private String type;
    private String category;
    private Boolean read;
    private String timestamp; // formatted ISO for frontend
    private LocalDateTime createdAt;

    public NotificationResponse() {}

    public NotificationResponse(Long id, Long userId, String userRole, String title,
                                String message, String type, String category, Boolean read,
                                String timestamp, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userRole = userRole;
        this.title = title;
        this.message = message;
        this.type = type;
        this.category = category;
        this.read = read != null ? read : false;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
    }

    public static NotificationResponseBuilder builder() {
        return new NotificationResponseBuilder();
    }

    public static class NotificationResponseBuilder {
        private Long id;
        private Long userId;
        private String userRole;
        private String title;
        private String message;
        private String type;
        private String category;
        private Boolean read = false;
        private String timestamp;
        private LocalDateTime createdAt;

        public NotificationResponseBuilder id(Long id) { this.id = id; return this; }
        public NotificationResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public NotificationResponseBuilder userRole(String userRole) { this.userRole = userRole; return this; }
        public NotificationResponseBuilder title(String title) { this.title = title; return this; }
        public NotificationResponseBuilder message(String message) { this.message = message; return this; }
        public NotificationResponseBuilder type(String type) { this.type = type; return this; }
        public NotificationResponseBuilder category(String category) { this.category = category; return this; }
        public NotificationResponseBuilder read(Boolean read) { this.read = read; return this; }
        public NotificationResponseBuilder timestamp(String timestamp) { this.timestamp = timestamp; return this; }
        public NotificationResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NotificationResponse build() {
            return new NotificationResponse(id, userId, userRole, title, message, type,
                    category, read, timestamp, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
