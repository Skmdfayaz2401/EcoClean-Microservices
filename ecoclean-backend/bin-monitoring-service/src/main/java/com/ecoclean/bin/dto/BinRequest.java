package com.ecoclean.bin.dto;

public class BinRequest {
    private String id;
    private String location;
    private String area;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
    private String wasteType;
    private Integer fillPercentage;
    private Integer batteryLevel;
    private Integer temperature;
    private String status;

    public BinRequest() {}

    public BinRequest(String id, String location, String area, Double latitude, Double longitude,
                      Integer capacity, String wasteType, Integer fillPercentage, Integer batteryLevel,
                      Integer temperature, String status) {
        this.id = id;
        this.location = location;
        this.area = area;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capacity = capacity;
        this.wasteType = wasteType;
        this.fillPercentage = fillPercentage;
        this.batteryLevel = batteryLevel;
        this.temperature = temperature;
        this.status = status;
    }

    public static BinRequestBuilder builder() {
        return new BinRequestBuilder();
    }

    public static class BinRequestBuilder {
        private String id;
        private String location;
        private String area;
        private Double latitude;
        private Double longitude;
        private Integer capacity;
        private String wasteType;
        private Integer fillPercentage;
        private Integer batteryLevel;
        private Integer temperature;
        private String status;

        public BinRequestBuilder id(String id) { this.id = id; return this; }
        public BinRequestBuilder location(String location) { this.location = location; return this; }
        public BinRequestBuilder area(String area) { this.area = area; return this; }
        public BinRequestBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public BinRequestBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public BinRequestBuilder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public BinRequestBuilder wasteType(String wasteType) { this.wasteType = wasteType; return this; }
        public BinRequestBuilder fillPercentage(Integer fillPercentage) { this.fillPercentage = fillPercentage; return this; }
        public BinRequestBuilder batteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; return this; }
        public BinRequestBuilder temperature(Integer temperature) { this.temperature = temperature; return this; }
        public BinRequestBuilder status(String status) { this.status = status; return this; }

        public BinRequest build() {
            return new BinRequest(id, location, area, latitude, longitude, capacity,
                    wasteType, fillPercentage, batteryLevel, temperature, status);
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
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    public Integer getTemperature() { return temperature; }
    public void setTemperature(Integer temperature) { this.temperature = temperature; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
