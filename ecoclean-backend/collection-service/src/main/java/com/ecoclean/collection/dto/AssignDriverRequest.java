package com.ecoclean.collection.dto;

public class AssignDriverRequest {
    private String driverId;
    private String driverName;

    public AssignDriverRequest() {}

    public AssignDriverRequest(String driverId, String driverName) {
        this.driverId = driverId;
        this.driverName = driverName;
    }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
}
