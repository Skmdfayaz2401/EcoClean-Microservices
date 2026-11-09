package com.ecoclean.bin.service;

import com.ecoclean.bin.client.NotificationClient;
import com.ecoclean.bin.dto.NotificationEvent;
import com.ecoclean.bin.entity.Bin;
import com.ecoclean.bin.repository.BinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
public class TelemetrySimulator {

    @Autowired
    private BinRepository binRepository;

    @Autowired
    private BinService binService;

    @Autowired(required = false)
    private NotificationClient notificationClient;

    @Value("${telemetry.simulation.enabled:true}")
    private boolean simulationEnabled;

    private final Random random = new Random();

    // Runs every 30 seconds to simulate real-time IoT sensor telemetry
    @Scheduled(fixedRateString = "${telemetry.simulation.interval:30000}")
    public void runSimulation() {
        if (!simulationEnabled) {
            return;
        }
        triggerTelemetryPulse();
    }

    public synchronized void triggerTelemetryPulse() {
        List<Bin> bins = binRepository.findAll();
        if (bins.isEmpty()) return;

        for (Bin bin : bins) {
            // Gradual increase: 75% chance of +1% to +5% increase; 10% chance of +8% (dumping)
            int currentFill = bin.getFillPercentage() != null ? bin.getFillPercentage() : 10;
            int delta;
            int roll = random.nextInt(100);

            if (currentFill >= 98) {
                delta = 0; // capped
            } else if (roll < 75) {
                delta = random.nextInt(4) + 1; // +1 to +4
            } else if (roll < 90) {
                delta = random.nextInt(6) + 4; // +4 to +9 (bulk disposal)
            } else {
                delta = 0; // no change
            }

            int newFill = Math.min(100, currentFill + delta);
            bin.setFillPercentage(newFill);

            // Slight battery discharge simulation
            int currentBatt = bin.getBatteryLevel() != null ? bin.getBatteryLevel() : 95;
            if (random.nextInt(10) == 0 && currentBatt > 20) {
                bin.setBatteryLevel(currentBatt - 1);
            }

            // Temperature fluctuation
            bin.setTemperature(20 + random.nextInt(12));
            bin.setLastUpdated("Just now (Simulated)");

            // Recalculate status & priorities
            bin.recalculateStatus();
            binRepository.save(bin);

            // Save telemetry history
            binService.saveTelemetryRecord(bin);

            // Trigger notification if bin just reached critical status (>= 90%)
            if (newFill >= 90 && currentFill < 90) {
                try {
                    if (notificationClient != null) {
                        notificationClient.sendNotification(NotificationEvent.builder()
                                .userRole("ADMIN")
                                .title("Critical Bin Capacity Alert: " + bin.getId())
                                .message("Bin " + bin.getId() + " at " + bin.getLocation() + " (" + bin.getArea() + ") has reached " + newFill + "% capacity and requires immediate collection dispatch.")
                                .type("CRITICAL")
                                .category("bin-alert")
                                .build());
                    }
                } catch (Exception e) {
                    System.err.println("Could not dispatch critical bin alert: " + e.getMessage());
                }
            }
        }
    }
}
