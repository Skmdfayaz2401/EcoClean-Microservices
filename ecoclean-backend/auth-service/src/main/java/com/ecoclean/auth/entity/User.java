package com.ecoclean.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role; // "ADMIN" or "DRIVER"

    private String phone;
    private String driverId; // e.g. DRV-001
    private String vehicle;
    private String vehicleId;
    private String shift;
    private String licenseNumber;
    private String address;

    @Column(nullable = false)
    private String status; // "PENDING", "APPROVED", "REJECTED"

    private Double rating = 4.5;
    private Integer completedCollections = 0;
    private Boolean active = true;
    private String department;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public User() {}

    public User(Long id, String name, String email, String passwordHash, String role, String phone,
                String driverId, String vehicle, String vehicleId, String shift, String licenseNumber,
                String address, String status, Double rating, Integer completedCollections,
                Boolean active, String department, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.phone = phone;
        this.driverId = driverId;
        this.vehicle = vehicle;
        this.vehicleId = vehicleId;
        this.shift = shift;
        this.licenseNumber = licenseNumber;
        this.address = address;
        this.status = status;
        this.rating = rating != null ? rating : 4.5;
        this.completedCollections = completedCollections != null ? completedCollections : 0;
        this.active = active != null ? active : true;
        this.department = department;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (rating == null) {
            rating = 4.5;
        }
        if (completedCollections == null) {
            completedCollections = 0;
        }
        if (active == null) {
            active = true;
        }
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String passwordHash;
        private String role;
        private String phone;
        private String driverId;
        private String vehicle;
        private String vehicleId;
        private String shift;
        private String licenseNumber;
        private String address;
        private String status;
        private Double rating = 4.5;
        private Integer completedCollections = 0;
        private Boolean active = true;
        private String department;
        private LocalDateTime createdAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder role(String role) { this.role = role; return this; }
        public UserBuilder phone(String phone) { this.phone = phone; return this; }
        public UserBuilder driverId(String driverId) { this.driverId = driverId; return this; }
        public UserBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public UserBuilder vehicleId(String vehicleId) { this.vehicleId = vehicleId; return this; }
        public UserBuilder shift(String shift) { this.shift = shift; return this; }
        public UserBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public UserBuilder address(String address) { this.address = address; return this; }
        public UserBuilder status(String status) { this.status = status; return this; }
        public UserBuilder rating(Double rating) { this.rating = rating; return this; }
        public UserBuilder completedCollections(Integer completedCollections) { this.completedCollections = completedCollections; return this; }
        public UserBuilder active(Boolean active) { this.active = active; return this; }
        public UserBuilder department(String department) { this.department = department; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, name, email, passwordHash, role, phone, driverId, vehicle,
                    vehicleId, shift, licenseNumber, address, status, rating,
                    completedCollections, active, department, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
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
