package com.ecoclean.collection.dto;

import java.time.LocalDateTime;

public class CollectionResponse {
    private String id;
    private String binId;
    private String binLocation;
    private Integer fillLevel;
    private String priority;
    private String assignedDriver;
    private String assignedDriverId;
    private String scheduledDate;
    private String scheduledTime;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    public CollectionResponse() {}

    public CollectionResponse(String id, String binId, String binLocation, Integer fillLevel,
                              String priority, String assignedDriver, String assignedDriverId,
                              String scheduledDate, String scheduledTime, String status,
                              String notes, LocalDateTime createdAt, LocalDateTime updatedAt,
                              LocalDateTime completedAt) {
        this.id = id;
        this.binId = binId;
        this.binLocation = binLocation;
        this.fillLevel = fillLevel;
        this.priority = priority;
        this.assignedDriver = assignedDriver;
        this.assignedDriverId = assignedDriverId;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.completedAt = completedAt;
    }

    public static CollectionResponseBuilder builder() {
        return new CollectionResponseBuilder();
    }

    public static class CollectionResponseBuilder {
        private String id;
        private String binId;
        private String binLocation;
        private Integer fillLevel;
        private String priority;
        private String assignedDriver;
        private String assignedDriverId;
        private String scheduledDate;
        private String scheduledTime;
        private String status;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime completedAt;

        public CollectionResponseBuilder id(String id) { this.id = id; return this; }
        public CollectionResponseBuilder binId(String binId) { this.binId = binId; return this; }
        public CollectionResponseBuilder binLocation(String binLocation) { this.binLocation = binLocation; return this; }
        public CollectionResponseBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public CollectionResponseBuilder priority(String priority) { this.priority = priority; return this; }
        public CollectionResponseBuilder assignedDriver(String assignedDriver) { this.assignedDriver = assignedDriver; return this; }
        public CollectionResponseBuilder assignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; return this; }
        public CollectionResponseBuilder scheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; return this; }
        public CollectionResponseBuilder scheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; return this; }
        public CollectionResponseBuilder status(String status) { this.status = status; return this; }
        public CollectionResponseBuilder notes(String notes) { this.notes = notes; return this; }
        public CollectionResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CollectionResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public CollectionResponseBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }

        public CollectionResponse build() {
            return new CollectionResponse(id, binId, binLocation, fillLevel, priority,
                    assignedDriver, assignedDriverId, scheduledDate, scheduledTime,
                    status, notes, createdAt, updatedAt, completedAt);
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
