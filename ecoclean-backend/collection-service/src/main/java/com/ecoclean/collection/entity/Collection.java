package com.ecoclean.collection.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "collections")
public class Collection {

    @Id
    private String id; // e.g. "COL-001"

    @Column(nullable = false)
    private String binId;

    private String binLocation;
    private Integer fillLevel;
    private String priority = "Medium";
    private String assignedDriver;
    private String assignedDriverId;
    private String scheduledDate;
    private String scheduledTime;

    @Column(nullable = false)
    private String status = "Pending";

    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    public Collection() {}

    public Collection(String id, String binId, String binLocation, Integer fillLevel, String priority,
                      String assignedDriver, String assignedDriverId, String scheduledDate,
                      String scheduledTime, String status, String notes, LocalDateTime createdAt,
                      LocalDateTime updatedAt, LocalDateTime completedAt) {
        this.id = id;
        this.binId = binId;
        this.binLocation = binLocation;
        this.fillLevel = fillLevel;
        this.priority = priority != null ? priority : "Medium";
        this.assignedDriver = assignedDriver;
        this.assignedDriverId = assignedDriverId;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.status = status != null ? status : "Pending";
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.completedAt = completedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static CollectionBuilder builder() {
        return new CollectionBuilder();
    }

    public static class CollectionBuilder {
        private String id;
        private String binId;
        private String binLocation;
        private Integer fillLevel;
        private String priority = "Medium";
        private String assignedDriver;
        private String assignedDriverId;
        private String scheduledDate;
        private String scheduledTime;
        private String status = "Pending";
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime completedAt;

        public CollectionBuilder id(String id) { this.id = id; return this; }
        public CollectionBuilder binId(String binId) { this.binId = binId; return this; }
        public CollectionBuilder binLocation(String binLocation) { this.binLocation = binLocation; return this; }
        public CollectionBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public CollectionBuilder priority(String priority) { this.priority = priority; return this; }
        public CollectionBuilder assignedDriver(String assignedDriver) { this.assignedDriver = assignedDriver; return this; }
        public CollectionBuilder assignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; return this; }
        public CollectionBuilder scheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; return this; }
        public CollectionBuilder scheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; return this; }
        public CollectionBuilder status(String status) { this.status = status; return this; }
        public CollectionBuilder notes(String notes) { this.notes = notes; return this; }
        public CollectionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CollectionBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public CollectionBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }

        public Collection build() {
            return new Collection(id, binId, binLocation, fillLevel, priority, assignedDriver,
                    assignedDriverId, scheduledDate, scheduledTime, status, notes,
                    createdAt, updatedAt, completedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }
    public String getBinLocation() { return binLocation; }
    public void setBinLocation(String binLocation) { this.binLocation = binLocation; }
    public Integer getFillLevel() { return fillLevel; }
    public void setFillLevel(Integer fillLevel) { this.fillLevel = fillLevel; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getAssignedDriver() { return assignedDriver; }
    public void setAssignedDriver(String assignedDriver) { this.assignedDriver = assignedDriver; }
    public String getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; }
    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }
    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
