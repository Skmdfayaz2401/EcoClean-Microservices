package com.ecoclean.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterDriverRequest {
    @NotBlank(message = "Full name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;
    private String vehicle;
    private String vehicleId;
    private String shift;
    private String licenseNumber;
    private String address;

    public RegisterDriverRequest() {}

    public RegisterDriverRequest(String name, String email, String password, String phone,
                                 String vehicle, String vehicleId, String shift,
                                 String licenseNumber, String address) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.vehicle = vehicle;
        this.vehicleId = vehicleId;
        this.shift = shift;
        this.licenseNumber = licenseNumber;
        this.address = address;
    }

    public static RegisterDriverRequestBuilder builder() {
        return new RegisterDriverRequestBuilder();
    }

    public static class RegisterDriverRequestBuilder {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String vehicle;
        private String vehicleId;
        private String shift;
        private String licenseNumber;
        private String address;

        public RegisterDriverRequestBuilder name(String name) { this.name = name; return this; }
        public RegisterDriverRequestBuilder email(String email) { this.email = email; return this; }
        public RegisterDriverRequestBuilder password(String password) { this.password = password; return this; }
        public RegisterDriverRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public RegisterDriverRequestBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public RegisterDriverRequestBuilder vehicleId(String vehicleId) { this.vehicleId = vehicleId; return this; }
        public RegisterDriverRequestBuilder shift(String shift) { this.shift = shift; return this; }
        public RegisterDriverRequestBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public RegisterDriverRequestBuilder address(String address) { this.address = address; return this; }

        public RegisterDriverRequest build() {
            return new RegisterDriverRequest(name, email, password, phone, vehicle, vehicleId, shift, licenseNumber, address);
        }
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
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
}
