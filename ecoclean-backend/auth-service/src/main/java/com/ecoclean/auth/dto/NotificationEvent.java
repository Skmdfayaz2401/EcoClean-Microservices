package com.ecoclean.auth.dto;

public class NotificationEvent {
    private Long userId;
    private String userRole;
    private String title;
    private String message;
    private String type; // "CRITICAL", "WARNING", "INFO", "SUCCESS"
    private String category;

    public NotificationEvent() {}

    public NotificationEvent(Long userId, String userRole, String title, String message, String type, String category) {
        this.userId = userId;
        this.userRole = userRole;
        this.title = title;
        this.message = message;
        this.type = type;
        this.category = category;
    }

    public static NotificationEventBuilder builder() {
        return new NotificationEventBuilder();
    }

    public static class NotificationEventBuilder {
        private Long userId;
        private String userRole;
        private String title;
        private String message;
        private String type;
        private String category;

        public NotificationEventBuilder userId(Long userId) { this.userId = userId; return this; }
        public NotificationEventBuilder userRole(String userRole) { this.userRole = userRole; return this; }
        public NotificationEventBuilder title(String title) { this.title = title; return this; }
        public NotificationEventBuilder message(String message) { this.message = message; return this; }
        public NotificationEventBuilder type(String type) { this.type = type; return this; }
        public NotificationEventBuilder category(String category) { this.category = category; return this; }

        public NotificationEvent build() {
            return new NotificationEvent(userId, userRole, title, message, type, category);
        }
    }

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
}
