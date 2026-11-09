package com.ecoclean.route.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routes")
public class Route {

    @Id
    private String id; // e.g. "R-101"

    private String driverId;
    private String driverName;
    private String vehicleId;
    private String vehicle;
    private String date;
    private String startLocation = "EcoClean Municipal Central Depot";
    private Double totalDistance = 0.0; // km
    private Integer estimatedDuration = 0; // minutes
    private Integer numberOfStops = 0;

    @Column(nullable = false)
    private String status = "Optimized";

    private Integer optimizationScore = 95;
    private Double fuelSaved = 4.2;
    private Double co2Reduced = 11.5;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sequenceNumber ASC")
    private List<RouteStop> stops = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Route() {}

    public Route(String id, String driverId, String driverName, String vehicleId, String vehicle,
                 String date, String startLocation, Double totalDistance, Integer estimatedDuration,
                 Integer numberOfStops, String status, Integer optimizationScore, Double fuelSaved,
                 Double co2Reduced, List<RouteStop> stops, LocalDateTime createdAt) {
        this.id = id;
        this.driverId = driverId;
        this.driverName = driverName;
        this.vehicleId = vehicleId;
        this.vehicle = vehicle;
        this.date = date;
        this.startLocation = startLocation != null ? startLocation : "EcoClean Municipal Central Depot";
        this.totalDistance = totalDistance != null ? totalDistance : 0.0;
        this.estimatedDuration = estimatedDuration != null ? estimatedDuration : 0;
        this.numberOfStops = numberOfStops != null ? numberOfStops : 0;
        this.status = status != null ? status : "Optimized";
        this.optimizationScore = optimizationScore != null ? optimizationScore : 95;
        this.fuelSaved = fuelSaved != null ? fuelSaved : 4.2;
        this.co2Reduced = co2Reduced != null ? co2Reduced : 11.5;
        this.stops = stops != null ? stops : new ArrayList<>();
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public static RouteBuilder builder() {
        return new RouteBuilder();
    }

    public static class RouteBuilder {
        private String id;
        private String driverId;
        private String driverName;
        private String vehicleId;
        private String vehicle;
        private String date;
        private String startLocation = "EcoClean Municipal Central Depot";
        private Double totalDistance = 0.0;
        private Integer estimatedDuration = 0;
        private Integer numberOfStops = 0;
        private String status = "Optimized";
        private Integer optimizationScore = 95;
        private Double fuelSaved = 4.2;
        private Double co2Reduced = 11.5;
        private List<RouteStop> stops = new ArrayList<>();
        private LocalDateTime createdAt;

        public RouteBuilder id(String id) { this.id = id; return this; }
        public RouteBuilder driverId(String driverId) { this.driverId = driverId; return this; }
        public RouteBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public RouteBuilder vehicleId(String vehicleId) { this.vehicleId = vehicleId; return this; }
        public RouteBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public RouteBuilder date(String date) { this.date = date; return this; }
        public RouteBuilder startLocation(String startLocation) { this.startLocation = startLocation; return this; }
        public RouteBuilder totalDistance(Double totalDistance) { this.totalDistance = totalDistance; return this; }
        public RouteBuilder estimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }
        public RouteBuilder numberOfStops(Integer numberOfStops) { this.numberOfStops = numberOfStops; return this; }
        public RouteBuilder status(String status) { this.status = status; return this; }
        public RouteBuilder optimizationScore(Integer optimizationScore) { this.optimizationScore = optimizationScore; return this; }
        public RouteBuilder fuelSaved(Double fuelSaved) { this.fuelSaved = fuelSaved; return this; }
        public RouteBuilder co2Reduced(Double co2Reduced) { this.co2Reduced = co2Reduced; return this; }
        public RouteBuilder stops(List<RouteStop> stops) { this.stops = stops; return this; }
        public RouteBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Route build() {
            return new Route(id, driverId, driverName, vehicleId, vehicle, date, startLocation,
                    totalDistance, estimatedDuration, numberOfStops, status, optimizationScore,
                    fuelSaved, co2Reduced, stops, createdAt);
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
    public List<RouteStop> getStops() { return stops; }
    public void setStops(List<RouteStop> stops) { this.stops = stops; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
