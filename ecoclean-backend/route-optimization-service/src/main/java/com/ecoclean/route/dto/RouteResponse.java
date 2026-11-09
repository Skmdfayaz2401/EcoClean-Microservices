package com.ecoclean.route.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RouteResponse {
    private String id;
    private String driverId;
    private String driverName;
    private String vehicleId;
    private String vehicle;
    private String date;
    private String startLocation;
    private Double totalDistance;
    private Integer estimatedDuration;
    private String durationFormatted;
    private Integer numberOfStops;
    private String status;
    private Integer optimizationScore;
    private Double fuelSaved;
    private Double co2Reduced;
    private List<RouteStopDto> stops;
    private LocalDateTime createdAt;

    public RouteResponse() {}

    public RouteResponse(String id, String driverId, String driverName, String vehicleId,
                         String vehicle, String date, String startLocation, Double totalDistance,
                         Integer estimatedDuration, String durationFormatted, Integer numberOfStops,
                         String status, Integer optimizationScore, Double fuelSaved,
                         Double co2Reduced, List<RouteStopDto> stops, LocalDateTime createdAt) {
        this.id = id;
        this.driverId = driverId;
        this.driverName = driverName;
        this.vehicleId = vehicleId;
        this.vehicle = vehicle;
        this.date = date;
        this.startLocation = startLocation;
        this.totalDistance = totalDistance;
        this.estimatedDuration = estimatedDuration;
        this.durationFormatted = durationFormatted;
        this.numberOfStops = numberOfStops;
        this.status = status;
        this.optimizationScore = optimizationScore;
        this.fuelSaved = fuelSaved;
        this.co2Reduced = co2Reduced;
        this.stops = stops;
        this.createdAt = createdAt;
    }

    public static RouteResponseBuilder builder() {
        return new RouteResponseBuilder();
    }

    public static class RouteResponseBuilder {
        private String id;
        private String driverId;
        private String driverName;
        private String vehicleId;
        private String vehicle;
        private String date;
        private String startLocation;
        private Double totalDistance;
        private Integer estimatedDuration;
        private String durationFormatted;
        private Integer numberOfStops;
        private String status;
        private Integer optimizationScore;
        private Double fuelSaved;
        private Double co2Reduced;
        private List<RouteStopDto> stops;
        private LocalDateTime createdAt;

        public RouteResponseBuilder id(String id) { this.id = id; return this; }
        public RouteResponseBuilder driverId(String driverId) { this.driverId = driverId; return this; }
        public RouteResponseBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public RouteResponseBuilder vehicleId(String vehicleId) { this.vehicleId = vehicleId; return this; }
        public RouteResponseBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public RouteResponseBuilder date(String date) { this.date = date; return this; }
        public RouteResponseBuilder startLocation(String startLocation) { this.startLocation = startLocation; return this; }
        public RouteResponseBuilder totalDistance(Double totalDistance) { this.totalDistance = totalDistance; return this; }
        public RouteResponseBuilder estimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }
        public RouteResponseBuilder durationFormatted(String durationFormatted) { this.durationFormatted = durationFormatted; return this; }
        public RouteResponseBuilder numberOfStops(Integer numberOfStops) { this.numberOfStops = numberOfStops; return this; }
        public RouteResponseBuilder status(String status) { this.status = status; return this; }
        public RouteResponseBuilder optimizationScore(Integer optimizationScore) { this.optimizationScore = optimizationScore; return this; }
        public RouteResponseBuilder fuelSaved(Double fuelSaved) { this.fuelSaved = fuelSaved; return this; }
        public RouteResponseBuilder co2Reduced(Double co2Reduced) { this.co2Reduced = co2Reduced; return this; }
        public RouteResponseBuilder stops(List<RouteStopDto> stops) { this.stops = stops; return this; }
        public RouteResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public RouteResponse build() {
            return new RouteResponse(id, driverId, driverName, vehicleId, vehicle, date,
                    startLocation, totalDistance, estimatedDuration, durationFormatted,
                    numberOfStops, status, optimizationScore, fuelSaved, co2Reduced,
                    stops, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }
    public Double getTotalDistance() { return totalDistance; }
    public void setTotalDistance(Double totalDistance) { this.totalDistance = totalDistance; }
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    public String getDurationFormatted() { return durationFormatted; }
    public void setDurationFormatted(String durationFormatted) { this.durationFormatted = durationFormatted; }
    public Integer getNumberOfStops() { return numberOfStops; }
    public void setNumberOfStops(Integer numberOfStops) { this.numberOfStops = numberOfStops; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getOptimizationScore() { return optimizationScore; }
    public void setOptimizationScore(Integer optimizationScore) { this.optimizationScore = optimizationScore; }
    public Double getFuelSaved() { return fuelSaved; }
    public void setFuelSaved(Double fuelSaved) { this.fuelSaved = fuelSaved; }
    public Double getCo2Reduced() { return co2Reduced; }
    public void setCo2Reduced(Double co2Reduced) { this.co2Reduced = co2Reduced; }
    public List<RouteStopDto> getStops() { return stops; }
    public void setStops(List<RouteStopDto> stops) { this.stops = stops; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
