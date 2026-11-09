package com.ecoclean.route.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "route_stops")
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @JsonIgnore
    private Route route;

    @Column(nullable = false)
    private Integer sequenceNumber;

    @Column(nullable = false)
    private String binId;

    private String location;
    private String area;
    private Integer fillLevel;
    private Double latitude;
    private Double longitude;
    private Double distanceFromPrevious; // km
    private String estimatedArrival;
    private String status = "Pending";

    public RouteStop() {}

    public RouteStop(Long id, Route route, Integer sequenceNumber, String binId, String location,
                     String area, Integer fillLevel, Double latitude, Double longitude,
                     Double distanceFromPrevious, String estimatedArrival, String status) {
        this.id = id;
        this.route = route;
        this.sequenceNumber = sequenceNumber;
        this.binId = binId;
        this.location = location;
        this.area = area;
        this.fillLevel = fillLevel;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceFromPrevious = distanceFromPrevious;
        this.estimatedArrival = estimatedArrival;
        this.status = status != null ? status : "Pending";
    }

    public static RouteStopBuilder builder() {
        return new RouteStopBuilder();
    }

    public static class RouteStopBuilder {
        private Long id;
        private Route route;
        private Integer sequenceNumber;
        private String binId;
        private String location;
        private String area;
        private Integer fillLevel;
        private Double latitude;
        private Double longitude;
        private Double distanceFromPrevious;
        private String estimatedArrival;
        private String status = "Pending";

        public RouteStopBuilder id(Long id) { this.id = id; return this; }
        public RouteStopBuilder route(Route route) { this.route = route; return this; }
        public RouteStopBuilder sequenceNumber(Integer sequenceNumber) { this.sequenceNumber = sequenceNumber; return this; }
        public RouteStopBuilder binId(String binId) { this.binId = binId; return this; }
        public RouteStopBuilder location(String location) { this.location = location; return this; }
        public RouteStopBuilder area(String area) { this.area = area; return this; }
        public RouteStopBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public RouteStopBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public RouteStopBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public RouteStopBuilder distanceFromPrevious(Double distanceFromPrevious) { this.distanceFromPrevious = distanceFromPrevious; return this; }
        public RouteStopBuilder estimatedArrival(String estimatedArrival) { this.estimatedArrival = estimatedArrival; return this; }
        public RouteStopBuilder status(String status) { this.status = status; return this; }

        public RouteStop build() {
            return new RouteStop(id, route, sequenceNumber, binId, location, area,
                    fillLevel, latitude, longitude, distanceFromPrevious,
                    estimatedArrival, status);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
    public Integer getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(Integer sequenceNumber) { this.sequenceNumber = sequenceNumber; }
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
