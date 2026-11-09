package com.ecoclean.notification.dto;

public class NotificationRequest {
    private Long userId;
    private String userRole;
    private String title;
    private String message;
    private String type;
    private String category;

    public NotificationRequest() {}

    public NotificationRequest(Long userId, String userRole, String title, String message, String type, String category) {
        this.userId = userId;
        this.userRole = userRole;
        this.title = title;
        this.message = message;
        this.type = type;
        this.category = category;
    }

    public static NotificationRequestBuilder builder() {
        return new NotificationRequestBuilder();
    }

    public static class NotificationRequestBuilder {
        private Long userId;
        private String userRole;
        private String title;
        private String message;
        private String type;
        private String category;

        public NotificationRequestBuilder userId(Long userId) { this.userId = userId; return this; }
        public NotificationRequestBuilder userRole(String userRole) { this.userRole = userRole; return this; }
        public NotificationRequestBuilder title(String title) { this.title = title; return this; }
        public NotificationRequestBuilder message(String message) { this.message = message; return this; }
        public NotificationRequestBuilder type(String type) { this.type = type; return this; }
        public NotificationRequestBuilder category(String category) { this.category = category; return this; }

        public NotificationRequest build() {
            return new NotificationRequest(userId, userRole, title, message, type, category);
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
