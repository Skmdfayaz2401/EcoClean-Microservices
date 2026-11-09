package com.ecoclean.auth.controller;

import com.ecoclean.auth.dto.*;
import com.ecoclean.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register-driver")
    public ResponseEntity<UserResponse> registerDriver(@Valid @RequestBody RegisterDriverRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerDriver(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
    }

    @GetMapping("/admin/drivers/pending")
    public ResponseEntity<List<UserResponse>> getPendingDrivers() {
        return ResponseEntity.ok(authService.getPendingDrivers());
    }

    @PutMapping("/admin/drivers/{id}/approve")
    public ResponseEntity<UserResponse> approveDriver(@PathVariable("id") Long id) {
        return ResponseEntity.ok(authService.approveDriver(id));
    }

    @PutMapping("/admin/drivers/{id}/reject")
    public ResponseEntity<UserResponse> rejectDriver(@PathVariable("id") Long id) {
        return ResponseEntity.ok(authService.rejectDriver(id));
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<UserResponse>> getAllApprovedDrivers() {
        return ResponseEntity.ok(authService.getAllApprovedDrivers());
    }

    @GetMapping("/admin/drivers")
    public ResponseEntity<List<UserResponse>> getAllDrivers() {
        return ResponseEntity.ok(authService.getAllApprovedDrivers());
    }

    @PutMapping("/drivers/{id}/toggle-active")
    public ResponseEntity<UserResponse> toggleActiveDriver(@PathVariable("id") Long id) {
        return ResponseEntity.ok(authService.toggleActive(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(Authentication authentication, @RequestBody UserResponse updateDto) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.updateProfile(authentication.getName(), updateDto));
    }
}
