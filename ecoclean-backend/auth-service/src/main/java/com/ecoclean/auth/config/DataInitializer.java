package com.ecoclean.auth.config;

import com.ecoclean.auth.entity.User;
import com.ecoclean.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed Admin if not present
        if (!userRepository.existsByEmail("admin@ecoclean.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@ecoclean.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .status("APPROVED")
                    .phone("555-0100")
                    .department("Municipal Operations")
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
        }

        // Seed Default Approved Driver
        if (!userRepository.existsByEmail("driver@ecoclean.com")) {
            User driver1 = User.builder()
                    .name("James Wilson")
                    .email("driver@ecoclean.com")
                    .passwordHash(passwordEncoder.encode("driver123"))
                    .role("DRIVER")
                    .status("APPROVED")
                    .phone("555-0201")
                    .driverId("DRV-001")
                    .vehicle("Truck #T-101 (Ford F-650)")
                    .vehicleId("VH-001")
                    .shift("Morning")
                    .licenseNumber("CDL-882194")
                    .rating(4.9)
                    .completedCollections(184)
                    .active(true)
                    .createdAt(LocalDateTime.now().minusDays(30))
                    .build();
            userRepository.save(driver1);
        }

        // Seed 2nd Approved Driver
        if (!userRepository.existsByEmail("raj@ecoclean.com")) {
            User driver2 = User.builder()
                    .name("Raj Kumar")
                    .email("raj@ecoclean.com")
                    .passwordHash(passwordEncoder.encode("raj123"))
                    .role("DRIVER")
                    .status("APPROVED")
                    .phone("555-0202")
                    .driverId("DRV-002")
                    .vehicle("Truck #T-102 (Volvo Electric)")
                    .vehicleId("VH-002")
                    .shift("Morning")
                    .licenseNumber("CDL-492102")
                    .rating(4.8)
                    .completedCollections(142)
                    .active(true)
                    .createdAt(LocalDateTime.now().minusDays(20))
                    .build();
            userRepository.save(driver2);
        }

        // Seed 3rd Approved Driver
        if (!userRepository.existsByEmail("marcus@ecoclean.com")) {
            User driver3 = User.builder()
                    .name("Marcus Vance")
                    .email("marcus@ecoclean.com")
                    .passwordHash(passwordEncoder.encode("marcus123"))
                    .role("DRIVER")
                    .status("APPROVED")
                    .phone("555-0203")
                    .driverId("DRV-003")
                    .vehicle("Compactor #C-103 (Mack LR)")
                    .vehicleId("VH-003")
                    .shift("Afternoon")
                    .licenseNumber("CDL-390184")
                    .rating(4.7)
                    .completedCollections(115)
                    .active(true)
                    .createdAt(LocalDateTime.now().minusDays(15))
                    .build();
            userRepository.save(driver3);
        }

        // Seed 1 PENDING driver for admin approval demonstration
        if (!userRepository.existsByEmail("ravi@gmail.com")) {
            User pendingDriver = User.builder()
                    .name("Ravi Kumar")
                    .email("ravi@gmail.com")
                    .passwordHash(passwordEncoder.encode("ravi123"))
                    .role("DRIVER")
                    .status("PENDING")
                    .phone("9876543210")
                    .driverId("DRV-007")
                    .vehicle("Truck #T-107 (Isuzu Heavy)")
                    .vehicleId("VH-007")
                    .shift("Morning")
                    .licenseNumber("CDL-998822")
                    .rating(4.5)
                    .completedCollections(0)
                    .active(true)
                    .createdAt(LocalDateTime.now().minusHours(2))
                    .build();
            userRepository.save(pendingDriver);
        }
    }
}
