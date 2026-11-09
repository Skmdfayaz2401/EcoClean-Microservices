package com.ecoclean.route.dto;

public class BinDto {
    private String id;
    private String location;
    private String area;
    private Double latitude;
    private Double longitude;
    private Integer fillPercentage;
    private Integer fillLevel;
    private String status;
    private String priority;

    public BinDto() {}

    public BinDto(String id, String location, String area, Double latitude, Double longitude,
                  Integer fillPercentage, Integer fillLevel, String status, String priority) {
        this.id = id;
        this.location = location;
        this.area = area;
        this.latitude = latitude;
        this.longitude = longitude;
        this.fillPercentage = fillPercentage;
        this.fillLevel = fillLevel != null ? fillLevel : fillPercentage;
        this.status = status;
        this.priority = priority;
    }

    public static BinDtoBuilder builder() {
        return new BinDtoBuilder();
    }

    public static class BinDtoBuilder {
        private String id;
        private String location;
        private String area;
        private Double latitude;
        private Double longitude;
        private Integer fillPercentage;
        private Integer fillLevel;
        private String status;
        private String priority;

        public BinDtoBuilder id(String id) { this.id = id; return this; }
        public BinDtoBuilder location(String location) { this.location = location; return this; }
        public BinDtoBuilder area(String area) { this.area = area; return this; }
        public BinDtoBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public BinDtoBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public BinDtoBuilder fillPercentage(Integer fillPercentage) {
            this.fillPercentage = fillPercentage;
            if (this.fillLevel == null) this.fillLevel = fillPercentage;
            return this;
        }
        public BinDtoBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public BinDtoBuilder status(String status) { this.status = status; return this; }
        public BinDtoBuilder priority(String priority) { this.priority = priority; return this; }

        public BinDto build() {
            return new BinDto(id, location, area, latitude, longitude, fillPercentage,
                    fillLevel != null ? fillLevel : fillPercentage, status, priority);
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
    public Integer getFillPercentage() { return fillPercentage; }
    public void setFillPercentage(Integer fillPercentage) {
        this.fillPercentage = fillPercentage;
        if (this.fillLevel == null) this.fillLevel = fillPercentage;
    }
    public Integer getFillLevel() { return fillLevel != null ? fillLevel : fillPercentage; }
    public void setFillLevel(Integer fillLevel) { this.fillLevel = fillLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
