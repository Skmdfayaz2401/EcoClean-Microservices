package com.ecoclean.auth;

import com.ecoclean.auth.dto.*;
import com.ecoclean.auth.entity.User;
import com.ecoclean.auth.repository.UserRepository;
import com.ecoclean.auth.security.JwtTokenProvider;
import com.ecoclean.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private User adminUser;
    private User pendingDriver;
    private User approvedDriver;

    @BeforeEach
    void setUp() {
        adminUser = User.builder()
                .id(1L)
                .name("Admin")
                .email("admin@ecoclean.com")
                .passwordHash("encodedAdmin123")
                .role("ADMIN")
                .status("APPROVED")
                .createdAt(LocalDateTime.now())
                .build();

        pendingDriver = User.builder()
                .id(2L)
                .name("Ravi Kumar")
                .email("ravi@gmail.com")
                .passwordHash("encodedRavi123")
                .role("DRIVER")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        approvedDriver = User.builder()
                .id(3L)
                .name("James Wilson")
                .email("driver@ecoclean.com")
                .passwordHash("encodedDriver123")
                .role("DRIVER")
                .status("APPROVED")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testAdminLoginSuccess() {
        when(userRepository.findByEmail("admin@ecoclean.com")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("admin123", "encodedAdmin123")).thenReturn(true);
        when(jwtTokenProvider.generateToken(any(), any(), any(), any())).thenReturn("mock-jwt-token");

        LoginResponse response = authService.login(new LoginRequest("admin@ecoclean.com", "admin123", "admin"));

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("admin@ecoclean.com", response.getUser().getEmail());
        assertEquals("ADMIN", response.getUser().getRole());
    }

    @Test
    void testPendingDriverLoginBlocked() {
        when(userRepository.findByEmail("ravi@gmail.com")).thenReturn(Optional.of(pendingDriver));
        when(passwordEncoder.matches("ravi123", "encodedRavi123")).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> {
            authService.login(new LoginRequest("ravi@gmail.com", "ravi123", "driver"));
        });
    }

    @Test
    void testDriverRegistrationCreatesPendingAccount() {
        when(userRepository.existsByEmail("newdriver@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("hashedSecret");
        when(userRepository.count()).thenReturn(5L);
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(10L);
            return u;
        });

        RegisterDriverRequest req = RegisterDriverRequest.builder()
                .name("New Driver")
                .email("newdriver@gmail.com")
                .password("secret123")
                .phone("555-0999")
                .vehicle("Truck #T-99")
                .build();

        UserResponse res = authService.registerDriver(req);

        assertNotNull(res);
        assertEquals("PENDING", res.getStatus());
        assertEquals("DRIVER", res.getRole());
        assertEquals("newdriver@gmail.com", res.getEmail());
    }

    @Test
    void testAdminApprovesDriver() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(pendingDriver));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UserResponse approved = authService.approveDriver(2L);

        assertNotNull(approved);
        assertEquals("APPROVED", approved.getStatus());
    }
}
