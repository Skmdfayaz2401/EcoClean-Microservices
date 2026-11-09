package com.ecoclean.collection.config;

import com.ecoclean.collection.entity.Collection;
import com.ecoclean.collection.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class CollectionDataInitializer implements CommandLineRunner {

    @Autowired
    private CollectionRepository collectionRepository;

    @Override
    public void run(String... args) {
        if (collectionRepository.count() > 0) return;

        LocalDateTime now = LocalDateTime.now();

        List<Collection> initial = Arrays.asList(
            createCol("COL-001", "BIN-001", "42 Main Street", 92, "Critical", "James Wilson", "DRV-001", now.plusHours(1), "Assigned", "Urgent commercial zone"),
            createCol("COL-002", "BIN-005", "55 Pine Lane", 95, "Critical", "James Wilson", "DRV-001", now.plusHours(2), "In-Progress", "Rear lane pickup"),
            createCol("COL-003", "BIN-009", "95 Market Square", 88, "High", "Raj Kumar", "DRV-002", now.plusHours(3), "Assigned", "Market day collection"),
            createCol("COL-004", "BIN-012", "180 Riverfront Drive", 91, "Critical", null, null, now.plusHours(4), "Pending", "Waterfront boardwalk bin"),
            createCol("COL-005", "BIN-016", "135 Sunset Blvd", 85, "High", null, null, now.plusHours(5), "Pending", "Residential peak load"),
            createCol("COL-006", "BIN-008", "210 Tech Plaza", 82, "High", "Marcus Vance", "DRV-003", now.plusHours(6), "Assigned", "Campus center"),
            createCol("COL-007", "BIN-004", "120 Elm Street", 78, "Medium", null, null, now.plusDays(1), "Pending", "Standard organic stream"),
            createCol("COL-008", "BIN-014", "22 Steel Works Road", 72, "Medium", null, null, now.plusDays(1), "Pending", "Industrial zone compactor"),
            createCol("COL-009", "BIN-002", "15 Oak Avenue", 64, "Medium", "James Wilson", "DRV-001", now.minusHours(4), "Completed", "Recyclables collected"),
            createCol("COL-010", "BIN-003", "88 Broadway Blvd", 35, "Low", "Raj Kumar", "DRV-002", now.minusHours(6), "Completed", "City center routine"),
            createCol("COL-011", "BIN-006", "300 Harbor View", 45, "Low", "Marcus Vance", "DRV-003", now.minusHours(8), "Completed", "Waterfront routine"),
            createCol("COL-012", "BIN-007", "77 Maple Road", 18, "Low", "James Wilson", "DRV-001", now.minusDays(1), "Completed", "Residential south routine"),
            createCol("COL-013", "BIN-011", "63 Cedar Lane", 25, "Low", "Raj Kumar", "DRV-002", now.minusDays(1), "Completed", "North sector completed"),
            createCol("COL-014", "BIN-015", "80 Heritage Street", 40, "Low", null, null, now.minusDays(2), "Cancelled", "Weather delay rescheduling"),
            createCol("COL-015", "BIN-017", "29 Dockside Alley", 76, "High", "Raj Kumar", "DRV-002", now.plusHours(2), "In-Progress", "Organic dockside"),
            createCol("COL-016", "BIN-010", "14 Industrial Parkway", 60, "Medium", "Marcus Vance", "DRV-003", now.plusHours(3), "In-Progress", "Hazardous bin inspection")
        );

        collectionRepository.saveAll(initial);
    }

    private Collection createCol(String id, String binId, String loc, int fill, String priority, String drv, String drvId, LocalDateTime time, String status, String notes) {
        return Collection.builder()
                .id(id)
                .binId(binId)
                .binLocation(loc)
                .fillLevel(fill)
                .priority(priority)
                .assignedDriver(drv)
                .assignedDriverId(drvId)
                .scheduledDate(time.toLocalDate().toString())
                .scheduledTime(time.toString())
                .status(status)
                .notes(notes)
                .createdAt(LocalDateTime.now().minusDays(2))
                .completedAt("Completed".equals(status) ? time : null)
                .build();
    }
}
