package com.ecoclean.auth.service;

import com.ecoclean.auth.client.NotificationClient;
import com.ecoclean.auth.dto.*;
import com.ecoclean.auth.entity.User;
import com.ecoclean.auth.repository.UserRepository;
import com.ecoclean.auth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired(required = false)
    private NotificationClient notificationClient;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // Enforce approval for drivers
        if ("DRIVER".equalsIgnoreCase(user.getRole())) {
            if ("PENDING".equalsIgnoreCase(user.getStatus())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Your driver account is pending administrator approval. Please wait for approval before logging in.");
            } else if ("REJECTED".equalsIgnoreCase(user.getStatus())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Your driver registration has been rejected by the administrator.");
            }
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole(), user.getName());
        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserResponse(user))
                .build();
    }

    public UserResponse registerDriver(RegisterDriverRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        long driverCount = userRepository.count();
        String generatedDriverId = "DRV-0" + (driverCount + 1);

        User driver = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("DRIVER")
                .status("PENDING") // Pending approval
                .phone(request.getPhone())
                .driverId(generatedDriverId)
                .vehicle(request.getVehicle() != null ? request.getVehicle() : "Standard Waste Truck")
                .vehicleId(request.getVehicleId() != null ? request.getVehicleId() : "VH-" + (driverCount + 10))
                .shift(request.getShift() != null ? request.getShift() : "Morning")
                .licenseNumber(request.getLicenseNumber())
                .address(request.getAddress())
                .active(true)
                .rating(4.5)
                .completedCollections(0)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(driver);

        // Notify Admin about new pending driver registration
        try {
            if (notificationClient != null) {
                notificationClient.sendNotification(NotificationEvent.builder()
                        .userRole("ADMIN")
                        .title("New Driver Registration Pending")
                        .message("Driver " + saved.getName() + " (" + saved.getEmail() + ") registered with vehicle " + saved.getVehicle() + " and is pending approval.")
                        .type("INFO")
                        .category("driver-approval")
                        .build());
            }
        } catch (Exception e) {
            System.err.println("Could not dispatch registration notification: " + e.getMessage());
        }

        return mapToUserResponse(saved);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return mapToUserResponse(user);
    }

    public List<UserResponse> getPendingDrivers() {
        return userRepository.findByStatus("PENDING").stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllApprovedDrivers() {
        return userRepository.findByRoleAndStatus("DRIVER", "APPROVED").stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse approveDriver(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver not found with id: " + id));

        user.setStatus("APPROVED");
        User updated = userRepository.save(user);

        // Dispatch approval notification to the driver
        try {
            if (notificationClient != null) {
                notificationClient.sendNotification(NotificationEvent.builder()
                        .userId(updated.getId())
                        .userRole("DRIVER")
                        .title("Driver Account Approved!")
                        .message("Congratulations " + updated.getName() + "! Your EcoClean driver account has been approved by the municipal administrator. You can now log in.")
                        .type("SUCCESS")
                        .category("driver-approval")
                        .build());
            }
        } catch (Exception e) {
            System.err.println("Could not dispatch approval notification: " + e.getMessage());
        }

        return mapToUserResponse(updated);
    }

    public UserResponse rejectDriver(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver not found with id: " + id));

        user.setStatus("REJECTED");
        User updated = userRepository.save(user);

        // Dispatch rejection notification
        try {
            if (notificationClient != null) {
                notificationClient.sendNotification(NotificationEvent.builder()
                        .userId(updated.getId())
                        .userRole("DRIVER")
                        .title("Driver Registration Update")
                        .message("Your EcoClean driver registration could not be approved at this time. Please contact municipal dispatch.")
                        .type("WARNING")
                        .category("driver-approval")
                        .build());
            }
        } catch (Exception e) {
            System.err.println("Could not dispatch rejection notification: " + e.getMessage());
        }

        return mapToUserResponse(updated);
    }

    public UserResponse toggleActive(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver not found"));
        user.setActive(!Boolean.TRUE.equals(user.getActive()));
        return mapToUserResponse(userRepository.save(user));
    }

    public UserResponse updateProfile(String email, UserResponse updateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (updateDto.getName() != null) user.setName(updateDto.getName());
        if (updateDto.getPhone() != null) user.setPhone(updateDto.getPhone());
        if (updateDto.getDepartment() != null) user.setDepartment(updateDto.getDepartment());
        if (updateDto.getVehicle() != null) user.setVehicle(updateDto.getVehicle());
        if (updateDto.getShift() != null) user.setShift(updateDto.getShift());
        if (updateDto.getAddress() != null) user.setAddress(updateDto.getAddress());

        return mapToUserResponse(userRepository.save(user));
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .driverId(user.getDriverId())
                .vehicle(user.getVehicle())
                .vehicleId(user.getVehicleId())
                .shift(user.getShift())
                .licenseNumber(user.getLicenseNumber())
                .address(user.getAddress())
                .rating(user.getRating())
                .completedCollections(user.getCompletedCollections())
                .active(user.getActive())
                .department(user.getDepartment())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
