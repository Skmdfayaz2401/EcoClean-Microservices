package com.ecoclean.route.dto;

public class RouteStopDto {
    private Long id;
    private Integer sequenceNumber;
    private Integer stopNumber; // alias
    private String binId;
    private String location;
    private String area;
    private Integer fillLevel;
    private Double latitude;
    private Double longitude;
    private Double distanceFromPrevious;
    private String estimatedArrival;
    private String status;

    public RouteStopDto() {}

    public RouteStopDto(Long id, Integer sequenceNumber, Integer stopNumber, String binId,
                        String location, String area, Integer fillLevel, Double latitude,
                        Double longitude, Double distanceFromPrevious, String estimatedArrival,
                        String status) {
        this.id = id;
        this.sequenceNumber = sequenceNumber;
        this.stopNumber = stopNumber != null ? stopNumber : sequenceNumber;
        this.binId = binId;
        this.location = location;
        this.area = area;
        this.fillLevel = fillLevel;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceFromPrevious = distanceFromPrevious;
        this.estimatedArrival = estimatedArrival;
        this.status = status;
    }

    public static RouteStopDtoBuilder builder() {
        return new RouteStopDtoBuilder();
    }

    public static class RouteStopDtoBuilder {
        private Long id;
        private Integer sequenceNumber;
        private Integer stopNumber;
        private String binId;
        private String location;
        private String area;
        private Integer fillLevel;
        private Double latitude;
        private Double longitude;
        private Double distanceFromPrevious;
        private String estimatedArrival;
        private String status;

        public RouteStopDtoBuilder id(Long id) { this.id = id; return this; }
        public RouteStopDtoBuilder sequenceNumber(Integer sequenceNumber) {
            this.sequenceNumber = sequenceNumber;
            if (this.stopNumber == null) this.stopNumber = sequenceNumber;
            return this;
        }
        public RouteStopDtoBuilder stopNumber(Integer stopNumber) { this.stopNumber = stopNumber; return this; }
        public RouteStopDtoBuilder binId(String binId) { this.binId = binId; return this; }
        public RouteStopDtoBuilder location(String location) { this.location = location; return this; }
        public RouteStopDtoBuilder area(String area) { this.area = area; return this; }
        public RouteStopDtoBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public RouteStopDtoBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public RouteStopDtoBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public RouteStopDtoBuilder distanceFromPrevious(Double distanceFromPrevious) { this.distanceFromPrevious = distanceFromPrevious; return this; }
        public RouteStopDtoBuilder estimatedArrival(String estimatedArrival) { this.estimatedArrival = estimatedArrival; return this; }
        public RouteStopDtoBuilder status(String status) { this.status = status; return this; }

        public RouteStopDto build() {
            return new RouteStopDto(id, sequenceNumber, stopNumber != null ? stopNumber : sequenceNumber,
                    binId, location, area, fillLevel, latitude, longitude, distanceFromPrevious,
                    estimatedArrival, status);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(Integer sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
        if (this.stopNumber == null) this.stopNumber = sequenceNumber;
    }
    public Integer getStopNumber() { return stopNumber != null ? stopNumber : sequenceNumber; }
    public void setStopNumber(Integer stopNumber) { this.stopNumber = stopNumber; }
    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public Integer getFillLevel() { return fillLevel; }
    public void setFillLevel(Integer fillLevel) { this.fillLevel = fillLevel; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getDistanceFromPrevious() { return distanceFromPrevious; }
    public void setDistanceFromPrevious(Double distanceFromPrevious) { this.distanceFromPrevious = distanceFromPrevious; }
    public String getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(String estimatedArrival) { this.estimatedArrival = estimatedArrival; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
