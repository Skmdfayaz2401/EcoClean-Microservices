package com.ecoclean.bin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bins")
public class Bin {

    @Id
    private String id; // e.g. "BIN-001"

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String area;

    private Double latitude;
    private Double longitude;

    private Integer capacity = 240; // Liters
    private String wasteType = "General";

    @Column(nullable = false)
    private Integer fillPercentage = 0;

    @Column(nullable = false)
    private String status = "Normal";

    private Integer batteryLevel = 95;
    private Integer temperature = 24;
    private String lastUpdated;
    private Boolean collectionRequired = false;
    private String priority = "Low";
    private String sensorId;
    private String installedDate;

    public Bin() {}

    public Bin(String id, String location, String area, Double latitude, Double longitude,
               Integer capacity, String wasteType, Integer fillPercentage, String status,
               Integer batteryLevel, Integer temperature, String lastUpdated,
               Boolean collectionRequired, String priority, String sensorId, String installedDate) {
        this.id = id;
        this.location = location;
        this.area = area;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capacity = capacity != null ? capacity : 240;
        this.wasteType = wasteType != null ? wasteType : "General";
        this.fillPercentage = fillPercentage != null ? fillPercentage : 0;
        this.status = status != null ? status : "Normal";
        this.batteryLevel = batteryLevel != null ? batteryLevel : 95;
        this.temperature = temperature != null ? temperature : 24;
        this.lastUpdated = lastUpdated;
        this.collectionRequired = collectionRequired != null ? collectionRequired : false;
        this.priority = priority != null ? priority : "Low";
        this.sensorId = sensorId;
        this.installedDate = installedDate;
    }

    public void recalculateStatus() {
        if (fillPercentage == null) fillPercentage = 0;
        if (fillPercentage < 0) fillPercentage = 0;
        if (fillPercentage > 100) fillPercentage = 100;

        if (fillPercentage <= 20) {
            this.status = "Empty";
            this.priority = "Low";
            this.collectionRequired = false;
        } else if (fillPercentage <= 50) {
            this.status = "Normal";
            this.priority = "Low";
            this.collectionRequired = false;
        } else if (fillPercentage <= 70) {
            this.status = "Medium";
            this.priority = "Medium";
            this.collectionRequired = false;
        } else if (fillPercentage <= 89) {
            this.status = "High";
            this.priority = "High";
            this.collectionRequired = true;
        } else {
            this.status = "Critical";
            this.priority = "Critical";
            this.collectionRequired = true;
        }
    }

    public static BinBuilder builder() {
        return new BinBuilder();
    }

    public static class BinBuilder {
        private String id;
        private String location;
        private String area;
        private Double latitude;
        private Double longitude;
        private Integer capacity = 240;
        private String wasteType = "General";
        private Integer fillPercentage = 0;
        private String status = "Normal";
        private Integer batteryLevel = 95;
        private Integer temperature = 24;
        private String lastUpdated;
        private Boolean collectionRequired = false;
        private String priority = "Low";
        private String sensorId;
        private String installedDate;

        public BinBuilder id(String id) { this.id = id; return this; }
        public BinBuilder location(String location) { this.location = location; return this; }
        public BinBuilder area(String area) { this.area = area; return this; }
        public BinBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public BinBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public BinBuilder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public BinBuilder wasteType(String wasteType) { this.wasteType = wasteType; return this; }
        public BinBuilder fillPercentage(Integer fillPercentage) { this.fillPercentage = fillPercentage; return this; }
        public BinBuilder status(String status) { this.status = status; return this; }
        public BinBuilder batteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; return this; }
        public BinBuilder temperature(Integer temperature) { this.temperature = temperature; return this; }
        public BinBuilder lastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; return this; }
        public BinBuilder collectionRequired(Boolean collectionRequired) { this.collectionRequired = collectionRequired; return this; }
        public BinBuilder priority(String priority) { this.priority = priority; return this; }
        public BinBuilder sensorId(String sensorId) { this.sensorId = sensorId; return this; }
        public BinBuilder installedDate(String installedDate) { this.installedDate = installedDate; return this; }

        public Bin build() {
            return new Bin(id, location, area, latitude, longitude, capacity, wasteType,
                    fillPercentage, status, batteryLevel, temperature, lastUpdated,
                    collectionRequired, priority, sensorId, installedDate);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }
    public Integer getFillPercentage() { return fillPercentage; }
    public void setFillPercentage(Integer fillPercentage) { this.fillPercentage = fillPercentage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    public Integer getTemperature() { return temperature; }
    public void setTemperature(Integer temperature) { this.temperature = temperature; }
    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
    public Boolean getCollectionRequired() { return collectionRequired; }
    public void setCollectionRequired(Boolean collectionRequired) { this.collectionRequired = collectionRequired; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getSensorId() { return sensorId; }
    public void setSensorId(String sensorId) { this.sensorId = sensorId; }
    public String getInstalledDate() { return installedDate; }
    public void setInstalledDate(String installedDate) { this.installedDate = installedDate; }
}
