package com.ecoclean.auth.dto;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String driverId;
    private String vehicle;
    private String vehicleId;
    private String shift;
    private String licenseNumber;
    private String address;
    private Double rating;
    private Integer completedCollections;
    private Boolean active;
    private String department;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String name, String email, String phone, String role, String status,
                        String driverId, String vehicle, String vehicleId, String shift,
                        String licenseNumber, String address, Double rating,
                        Integer completedCollections, Boolean active, String department,
                        LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.status = status;
        this.driverId = driverId;
        this.vehicle = vehicle;
        this.vehicleId = vehicleId;
        this.shift = shift;
        this.licenseNumber = licenseNumber;
        this.address = address;
        this.rating = rating;
        this.completedCollections = completedCollections;
        this.active = active;
        this.department = department;
        this.createdAt = createdAt;
    }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public static class UserResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String status;
        private String driverId;
        private String vehicle;
        private String vehicleId;
        private String shift;
        private String licenseNumber;
        private String address;
        private Double rating;
        private Integer completedCollections;
        private Boolean active;
        private String department;
        private LocalDateTime createdAt;

        public UserResponseBuilder id(Long id) { this.id = id; return this; }
        public UserResponseBuilder name(String name) { this.name = name; return this; }
        public UserResponseBuilder email(String email) { this.email = email; return this; }
        public UserResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public UserResponseBuilder role(String role) { this.role = role; return this; }
        public UserResponseBuilder status(String status) { this.status = status; return this; }
        public UserResponseBuilder driverId(String driverId) { this.driverId = driverId; return this; }
        public UserResponseBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public UserResponseBuilder vehicleId(String vehicleId) { this.vehicleId = vehicleId; return this; }
        public UserResponseBuilder shift(String shift) { this.shift = shift; return this; }
        public UserResponseBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public UserResponseBuilder address(String address) { this.address = address; return this; }
        public UserResponseBuilder rating(Double rating) { this.rating = rating; return this; }
        public UserResponseBuilder completedCollections(Integer completedCollections) { this.completedCollections = completedCollections; return this; }
        public UserResponseBuilder active(Boolean active) { this.active = active; return this; }
        public UserResponseBuilder department(String department) { this.department = department; return this; }
        public UserResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public UserResponse build() {
            return new UserResponse(id, name, email, phone, role, status, driverId,
                    vehicle, vehicleId, shift, licenseNumber, address, rating,
                    completedCollections, active, department, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getCompletedCollections() { return completedCollections; }
    public void setCompletedCollections(Integer completedCollections) { this.completedCollections = completedCollections; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
