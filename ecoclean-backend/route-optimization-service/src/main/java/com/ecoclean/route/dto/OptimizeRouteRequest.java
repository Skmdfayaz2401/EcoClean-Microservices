package com.ecoclean.route.dto;

import java.util.List;

public class OptimizeRouteRequest {
    private String driverId;
    private String driverName;
    private String vehicleId;
    private String vehicle;
    private List<String> binIds;
    private String date;

    public OptimizeRouteRequest() {}

    public OptimizeRouteRequest(String driverId, String driverName, String vehicleId, String vehicle, List<String> binIds, String date) {
        this.driverId = driverId;
        this.driverName = driverName;
        this.vehicleId = vehicleId;
        this.vehicle = vehicle;
        this.binIds = binIds;
        this.date = date;
    }

    public static OptimizeRouteRequestBuilder builder() {
        return new OptimizeRouteRequestBuilder();
    }

    public static class OptimizeRouteRequestBuilder {
        private String driverId;
        private String driverName;
        private String vehicleId;
        private String vehicle;
        private List<String> binIds;
        private String date;

        public OptimizeRouteRequestBuilder driverId(String driverId) { this.driverId = driverId; return this; }
        public OptimizeRouteRequestBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public OptimizeRouteRequestBuilder vehicleId(String vehicleId) { this.vehicleId = vehicleId; return this; }
        public OptimizeRouteRequestBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public OptimizeRouteRequestBuilder binIds(List<String> binIds) { this.binIds = binIds; return this; }
        public OptimizeRouteRequestBuilder date(String date) { this.date = date; return this; }

        public OptimizeRouteRequest build() {
            return new OptimizeRouteRequest(driverId, driverName, vehicleId, vehicle, binIds, date);
        }
    }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }
    public List<String> getBinIds() { return binIds; }
    public void setBinIds(List<String> binIds) { this.binIds = binIds; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
