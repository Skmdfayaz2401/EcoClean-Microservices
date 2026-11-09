package com.ecoclean.notification.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userRole; // "ADMIN", "DRIVER", "ALL"

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    private String type = "info"; // "critical", "warning", "info", "success"
    private String category; // "bin-alert", "driver-approval", "dispatch", "route", "system"
    private Boolean read = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(Long id, Long userId, String userRole, String title, String message,
                        String type, String category, Boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userRole = userRole;
        this.title = title;
        this.message = message;
        this.type = type != null ? type.toLowerCase() : "info";
        this.category = category;
        this.read = read != null ? read : false;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (read == null) read = false;
        if (type != null) type = type.toLowerCase();
    }

    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private Long id;
        private Long userId;
        private String userRole;
        private String title;
        private String message;
        private String type = "info";
        private String category;
        private Boolean read = false;
        private LocalDateTime createdAt;

        public NotificationBuilder id(Long id) { this.id = id; return this; }
        public NotificationBuilder userId(Long userId) { this.userId = userId; return this; }
        public NotificationBuilder userRole(String userRole) { this.userRole = userRole; return this; }
        public NotificationBuilder title(String title) { this.title = title; return this; }
        public NotificationBuilder message(String message) { this.message = message; return this; }
        public NotificationBuilder type(String type) { this.type = type; return this; }
        public NotificationBuilder category(String category) { this.category = category; return this; }
        public NotificationBuilder read(Boolean read) { this.read = read; return this; }
        public NotificationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Notification build() {
            return new Notification(id, userId, userRole, title, message, type, category, read, createdAt);
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
    public void setType(String type) { this.type = type != null ? type.toLowerCase() : "info"; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
