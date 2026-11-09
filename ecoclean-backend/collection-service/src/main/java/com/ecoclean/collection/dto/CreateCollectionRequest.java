package com.ecoclean.collection.dto;

public class CreateCollectionRequest {
    private String binId;
    private String binLocation;
    private Integer fillLevel;
    private String priority;
    private String driverId;
    private String driverName;
    private String assignedDriver;
    private String assignedDriverId;
    private String date;
    private String time;
    private String scheduledTime;
    private String status;
    private String notes;

    public CreateCollectionRequest() {}

    public CreateCollectionRequest(String binId, String binLocation, Integer fillLevel, String priority,
                                   String driverId, String driverName, String assignedDriver,
                                   String assignedDriverId, String date, String time,
                                   String scheduledTime, String status, String notes) {
        this.binId = binId;
        this.binLocation = binLocation;
        this.fillLevel = fillLevel;
        this.priority = priority;
        this.driverId = driverId;
        this.driverName = driverName;
        this.assignedDriver = assignedDriver;
        this.assignedDriverId = assignedDriverId;
        this.date = date;
        this.time = time;
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.notes = notes;
    }

    public static CreateCollectionRequestBuilder builder() {
        return new CreateCollectionRequestBuilder();
    }

    public static class CreateCollectionRequestBuilder {
        private String binId;
        private String binLocation;
        private Integer fillLevel;
        private String priority;
        private String driverId;
        private String driverName;
        private String assignedDriver;
        private String assignedDriverId;
        private String date;
        private String time;
        private String scheduledTime;
        private String status;
        private String notes;

        public CreateCollectionRequestBuilder binId(String binId) { this.binId = binId; return this; }
        public CreateCollectionRequestBuilder binLocation(String binLocation) { this.binLocation = binLocation; return this; }
        public CreateCollectionRequestBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public CreateCollectionRequestBuilder priority(String priority) { this.priority = priority; return this; }
        public CreateCollectionRequestBuilder driverId(String driverId) { this.driverId = driverId; return this; }
        public CreateCollectionRequestBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public CreateCollectionRequestBuilder assignedDriver(String assignedDriver) { this.assignedDriver = assignedDriver; return this; }
        public CreateCollectionRequestBuilder assignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; return this; }
        public CreateCollectionRequestBuilder date(String date) { this.date = date; return this; }
        public CreateCollectionRequestBuilder time(String time) { this.time = time; return this; }
        public CreateCollectionRequestBuilder scheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; return this; }
        public CreateCollectionRequestBuilder status(String status) { this.status = status; return this; }
        public CreateCollectionRequestBuilder notes(String notes) { this.notes = notes; return this; }

        public CreateCollectionRequest build() {
            return new CreateCollectionRequest(binId, binLocation, fillLevel, priority,
                    driverId, driverName, assignedDriver, assignedDriverId, date, time,
                    scheduledTime, status, notes);
        }
    }

    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }
    public String getBinLocation() { return binLocation; }
    public void setBinLocation(String binLocation) { this.binLocation = binLocation; }
    public Integer getFillLevel() { return fillLevel; }
    public void setFillLevel(Integer fillLevel) { this.fillLevel = fillLevel; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getAssignedDriver() { return assignedDriver; }
    public void setAssignedDriver(String assignedDriver) { this.assignedDriver = assignedDriver; }
    public String getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
