package com.ecoclean.notification.config;

import com.ecoclean.notification.entity.Notification;
import com.ecoclean.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class NotificationDataInitializer implements CommandLineRunner {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public void run(String... args) {
        if (notificationRepository.count() > 0) return;

        LocalDateTime now = LocalDateTime.now();

        List<Notification> initial = Arrays.asList(
            createNotif("ADMIN", "Critical Fill Level: BIN-005", "Bin BIN-005 at 55 Pine Lane has reached 95% capacity. Immediate dispatch recommended.", "critical", "bin-alert", now.minusMinutes(12), false),
            createNotif("ADMIN", "Critical Fill Level: BIN-001", "Bin BIN-001 at 42 Main Street has reached 92% capacity. Collection required.", "critical", "bin-alert", now.minusMinutes(28), false),
            createNotif("ADMIN", "New Driver Registration Pending", "Driver Ravi Kumar (ravi@gmail.com) registered and is pending approval.", "info", "driver-approval", now.minusHours(1), false),
            createNotif("DRIVER", "New Collection Assigned: COL-001", "You have been assigned to collect Bin BIN-001 at 42 Main Street (92% full).", "info", "dispatch", now.minusHours(2), false),
            createNotif("ALL", "Route Optimized: RT-001", "Route RT-001 (4 stops) optimized with 96% efficiency score and 4.2L fuel reduction.", "success", "route", now.minusHours(3), true),
            createNotif("ADMIN", "High Fill Level Alert: BIN-012", "Bin BIN-012 at 180 Riverfront Drive has reached 91% capacity.", "warning", "bin-alert", now.minusHours(4), true),
            createNotif("ALL", "Collection Completed: COL-009", "Driver James Wilson completed collection for Bin BIN-002 at 15 Oak Avenue.", "success", "collection", now.minusHours(5), true),
            createNotif("ADMIN", "High Fill Level Alert: BIN-009", "Bin BIN-009 at 95 Market Square is at 88% fill level.", "warning", "bin-alert", now.minusHours(6), true),
            createNotif("ALL", "Route Completed: RT-003", "Driver Marcus Vance completed Route RT-003 (4 stops) with zero skipped locations.", "success", "route", now.minusDays(1), true),
            createNotif("ALL", "IoT Telemetry Synchronized", "All 18 municipal bin sensors reported nominal telemetry pings.", "info", "system", now.minusDays(1), true),
            createNotif("ADMIN", "Low Battery Warning: BIN-005", "Sensor battery on BIN-005 at 55 Pine Lane is at 76%. Replacement scheduled.", "warning", "system", now.minusDays(2), true),
            createNotif("ALL", "Weekly Municipal Operations Report", "Weekly municipal waste report generated: 142 collections completed with 94.6% SLA.", "success", "system", now.minusDays(3), true)
        );

        notificationRepository.saveAll(initial);
    }

    private Notification createNotif(String role, String title, String message, String type, String cat, LocalDateTime time, boolean read) {
        return Notification.builder()
                .userRole(role)
                .title(title)
                .message(message)
                .type(type)
                .category(cat)
                .read(read)
                .createdAt(time)
                .build();
    }
}
