package com.ecoclean.bin.dto;

public class BinResponse {
    private String id;
    private String location;
    private String area;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
    private String wasteType;
    private Integer fillPercentage;
    private Integer fillLevel; // alias for frontend compatibility
    private String status;
    private Integer batteryLevel;
    private Integer temperature;
    private String lastUpdated;
    private Boolean collectionRequired;
    private String priority;
    private String sensorId;
    private String installedDate;

    public BinResponse() {}

    public BinResponse(String id, String location, String area, Double latitude, Double longitude,
                       Integer capacity, String wasteType, Integer fillPercentage, Integer fillLevel,
                       String status, Integer batteryLevel, Integer temperature, String lastUpdated,
                       Boolean collectionRequired, String priority, String sensorId, String installedDate) {
        this.id = id;
        this.location = location;
        this.area = area;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capacity = capacity;
        this.wasteType = wasteType;
        this.fillPercentage = fillPercentage;
        this.fillLevel = fillLevel != null ? fillLevel : fillPercentage;
        this.status = status;
        this.batteryLevel = batteryLevel;
        this.temperature = temperature;
        this.lastUpdated = lastUpdated;
        this.collectionRequired = collectionRequired;
        this.priority = priority;
        this.sensorId = sensorId;
        this.installedDate = installedDate;
    }

    public static BinResponseBuilder builder() {
        return new BinResponseBuilder();
    }

    public static class BinResponseBuilder {
        private String id;
        private String location;
        private String area;
        private Double latitude;
        private Double longitude;
        private Integer capacity;
        private String wasteType;
        private Integer fillPercentage;
        private Integer fillLevel;
        private String status;
        private Integer batteryLevel;
        private Integer temperature;
        private String lastUpdated;
        private Boolean collectionRequired;
        private String priority;
        private String sensorId;
        private String installedDate;

        public BinResponseBuilder id(String id) { this.id = id; return this; }
        public BinResponseBuilder location(String location) { this.location = location; return this; }
        public BinResponseBuilder area(String area) { this.area = area; return this; }
        public BinResponseBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public BinResponseBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public BinResponseBuilder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public BinResponseBuilder wasteType(String wasteType) { this.wasteType = wasteType; return this; }
        public BinResponseBuilder fillPercentage(Integer fillPercentage) {
            this.fillPercentage = fillPercentage;
            if (this.fillLevel == null) this.fillLevel = fillPercentage;
            return this;
        }
        public BinResponseBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public BinResponseBuilder status(String status) { this.status = status; return this; }
        public BinResponseBuilder batteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; return this; }
        public BinResponseBuilder temperature(Integer temperature) { this.temperature = temperature; return this; }
        public BinResponseBuilder lastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; return this; }
        public BinResponseBuilder collectionRequired(Boolean collectionRequired) { this.collectionRequired = collectionRequired; return this; }
        public BinResponseBuilder priority(String priority) { this.priority = priority; return this; }
        public BinResponseBuilder sensorId(String sensorId) { this.sensorId = sensorId; return this; }
        public BinResponseBuilder installedDate(String installedDate) { this.installedDate = installedDate; return this; }

        public BinResponse build() {
            return new BinResponse(id, location, area, latitude, longitude, capacity,
                    wasteType, fillPercentage, fillLevel != null ? fillLevel : fillPercentage,
                    status, batteryLevel, temperature, lastUpdated, collectionRequired,
                    priority, sensorId, installedDate);
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
    public void setFillPercentage(Integer fillPercentage) {
        this.fillPercentage = fillPercentage;
        if (this.fillLevel == null) this.fillLevel = fillPercentage;
    }
    public Integer getFillLevel() { return fillLevel != null ? fillLevel : fillPercentage; }
    public void setFillLevel(Integer fillLevel) { this.fillLevel = fillLevel; }
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
