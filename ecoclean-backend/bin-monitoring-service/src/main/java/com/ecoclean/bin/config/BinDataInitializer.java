package com.ecoclean.bin.config;

import com.ecoclean.bin.entity.Bin;
import com.ecoclean.bin.entity.Telemetry;
import com.ecoclean.bin.repository.BinRepository;
import com.ecoclean.bin.repository.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class BinDataInitializer implements CommandLineRunner {

    @Autowired
    private BinRepository binRepository;

    @Autowired
    private TelemetryRepository telemetryRepository;

    @Override
    public void run(String... args) {
        if (binRepository.count() > 0) {
            return; // already seeded
        }

        List<Bin> initialBins = Arrays.asList(
            createBinObj("BIN-001", "42 Main Street", "Commercial District", 40.7128, -74.0060, 240, "General", 92, 84, 24),
            createBinObj("BIN-002", "15 Oak Avenue", "Market Square", 40.7145, -74.0082, 360, "Recyclable", 64, 91, 22),
            createBinObj("BIN-003", "88 Broadway Blvd", "City Center", 40.7112, -74.0045, 660, "General", 35, 96, 25),
            createBinObj("BIN-004", "120 Elm Street", "Residential North", 40.7160, -74.0020, 240, "Organic", 78, 88, 23),
            createBinObj("BIN-005", "55 Pine Lane", "Commercial District", 40.7135, -74.0095, 360, "General", 95, 76, 26),
            createBinObj("BIN-006", "300 Harbor View", "Waterfront", 40.7090, -74.0110, 1100, "General", 45, 94, 21),
            createBinObj("BIN-007", "77 Maple Road", "Residential South", 40.7080, -74.0030, 240, "Recyclable", 18, 99, 20),
            createBinObj("BIN-008", "210 Tech Plaza", "University Campus", 40.7170, -74.0050, 360, "General", 82, 85, 24),
            createBinObj("BIN-009", "95 Market Square", "Market Square", 40.7150, -74.0075, 660, "Organic", 88, 80, 25),
            createBinObj("BIN-010", "14 Industrial Parkway", "Industrial Zone", 40.7050, -74.0150, 1100, "Hazardous", 60, 92, 22),
            createBinObj("BIN-011", "63 Cedar Lane", "Residential North", 40.7180, -74.0010, 240, "General", 25, 97, 21),
            createBinObj("BIN-012", "180 Riverfront Drive", "Waterfront", 40.7075, -74.0125, 360, "Recyclable", 91, 79, 23),
            createBinObj("BIN-013", "450 Academic Way", "University Campus", 40.7190, -74.0040, 240, "General", 55, 90, 24),
            createBinObj("BIN-014", "22 Steel Works Road", "Industrial Zone", 40.7040, -74.0170, 1100, "General", 72, 87, 26),
            createBinObj("BIN-015", "80 Heritage Street", "City Center", 40.7120, -74.0055, 360, "Recyclable", 40, 95, 22),
            createBinObj("BIN-016", "135 Sunset Blvd", "Residential South", 40.7070, -74.0025, 240, "General", 85, 82, 23),
            createBinObj("BIN-017", "29 Dockside Alley", "Waterfront", 40.7085, -74.0135, 660, "Organic", 30, 98, 20),
            createBinObj("BIN-018", "501 Logistics Loop", "Industrial Zone", 40.7030, -74.0180, 1100, "General", 11, 100, 21)
        );

        binRepository.saveAll(initialBins);

        // Seed 24h telemetry history for each bin
        LocalDateTime now = LocalDateTime.now();
        for (Bin b : initialBins) {
            int current = b.getFillPercentage();
            for (int h = 24; h >= 0; h -= 4) {
                int historicalFill = Math.max(5, current - (h * 3));
                Telemetry t = Telemetry.builder()
                        .binId(b.getId())
                        .fillPercentage(historicalFill)
                        .batteryLevel(b.getBatteryLevel())
                        .temperature(b.getTemperature())
                        .timestamp(now.minusHours(h))
                        .build();
                telemetryRepository.save(t);
            }
        }
    }

    private Bin createBinObj(String id, String location, String area, double lat, double lng, int cap, String waste, int fill, int batt, int temp) {
        Bin b = Bin.builder()
                .id(id)
                .location(location)
                .area(area)
                .latitude(lat)
                .longitude(lng)
                .capacity(cap)
                .wasteType(waste)
                .fillPercentage(fill)
                .batteryLevel(batt)
                .temperature(temp)
                .lastUpdated("2 min ago")
                .sensorId("SNS-" + id.replace("BIN-", ""))
                .installedDate("2024-01-15T08:00:00Z")
                .build();
        b.recalculateStatus();
        return b;
    }
}
