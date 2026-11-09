package com.ecoclean.bin.service;

import com.ecoclean.bin.client.NotificationClient;
import com.ecoclean.bin.dto.*;
import com.ecoclean.bin.entity.Bin;
import com.ecoclean.bin.entity.Telemetry;
import com.ecoclean.bin.repository.BinRepository;
import com.ecoclean.bin.repository.TelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BinService {

    @Autowired
    private BinRepository binRepository;

    @Autowired
    private TelemetryRepository telemetryRepository;

    @Autowired(required = false)
    private NotificationClient notificationClient;

    public List<BinResponse> getAllBins() {
        return binRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BinResponse getBinById(String id) {
        Bin bin = binRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bin not found with id: " + id));
        return mapToResponse(bin);
    }

    public BinResponse createBin(BinRequest request) {
        String binId = request.getId();
        if (binId == null || binId.trim().isEmpty()) {
            long count = binRepository.count();
            binId = "BIN-0" + (count + 1);
        }

        if (binRepository.existsById(binId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bin with ID " + binId + " already exists");
        }

        Bin bin = Bin.builder()
                .id(binId)
                .location(request.getLocation())
                .area(request.getArea() != null ? request.getArea() : "Commercial District")
                .latitude(request.getLatitude() != null ? request.getLatitude() : 40.7128)
                .longitude(request.getLongitude() != null ? request.getLongitude() : -74.0060)
                .capacity(request.getCapacity() != null ? request.getCapacity() : 240)
                .wasteType(request.getWasteType() != null ? request.getWasteType() : "General")
                .fillPercentage(request.getFillPercentage() != null ? request.getFillPercentage() : 15)
                .batteryLevel(request.getBatteryLevel() != null ? request.getBatteryLevel() : 98)
                .temperature(request.getTemperature() != null ? request.getTemperature() : 23)
                .lastUpdated("Just now")
                .sensorId("SNS-" + binId.replace("BIN-", ""))
                .installedDate(LocalDateTime.now().toString())
                .build();

        bin.recalculateStatus();
        Bin saved = binRepository.save(bin);

        // Record initial telemetry
        saveTelemetryRecord(saved);

        return mapToResponse(saved);
    }

    public BinResponse updateBin(String id, BinRequest request) {
        Bin bin = binRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bin not found with id: " + id));

        if (request.getLocation() != null) bin.setLocation(request.getLocation());
        if (request.getArea() != null) bin.setArea(request.getArea());
        if (request.getLatitude() != null) bin.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) bin.setLongitude(request.getLongitude());
        if (request.getCapacity() != null) bin.setCapacity(request.getCapacity());
        if (request.getWasteType() != null) bin.setWasteType(request.getWasteType());
        if (request.getFillPercentage() != null) bin.setFillPercentage(request.getFillPercentage());
        if (request.getBatteryLevel() != null) bin.setBatteryLevel(request.getBatteryLevel());
        if (request.getTemperature() != null) bin.setTemperature(request.getTemperature());

        bin.setLastUpdated("Just now");
        bin.recalculateStatus();
        Bin saved = binRepository.save(bin);

        saveTelemetryRecord(saved);

        return mapToResponse(saved);
    }

    public void deleteBin(String id) {
        if (!binRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bin not found with id: " + id);
        }
        binRepository.deleteById(id);
    }

    public List<TelemetryResponse> getTelemetryForBin(String binId) {
        List<Telemetry> history = telemetryRepository.findByBinIdOrderByTimestampAsc(binId);
        return history.stream().map(t -> TelemetryResponse.builder()
                .id(t.getId())
                .binId(t.getBinId())
                .fillPercentage(t.getFillPercentage())
                .fillLevel(t.getFillPercentage())
                .batteryLevel(t.getBatteryLevel())
                .temperature(t.getTemperature())
                .timestamp(t.getTimestamp())
                .build()).collect(Collectors.toList());
    }

    public BinResponse markForCollection(String id) {
        Bin bin = binRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bin not found with id: " + id));
        bin.setCollectionRequired(true);
        bin.setPriority("Critical");
        Bin saved = binRepository.save(bin);
        return mapToResponse(saved);
    }

    public BinResponse resetAfterCollection(String id) {
        Bin bin = binRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bin not found with id: " + id));

        int newFill = (int) (Math.random() * 8) + 8; // 8% to 15%
        bin.setFillPercentage(newFill);
        bin.setCollectionRequired(false);
        bin.setPriority("Low");
        bin.setStatus("Normal");
        bin.setLastUpdated("Just now (Emptied)");

        Bin saved = binRepository.save(bin);
        saveTelemetryRecord(saved);

        return mapToResponse(saved);
    }

    public BinStatistics getStatistics() {
        List<Bin> all = binRepository.findAll();
        long total = all.size();
        long critical = all.stream().filter(b -> "Critical".equalsIgnoreCase(b.getStatus())).count();
        long high = all.stream().filter(b -> "High".equalsIgnoreCase(b.getStatus())).count();
        long medium = all.stream().filter(b -> "Medium".equalsIgnoreCase(b.getStatus())).count();
        long normal = all.stream().filter(b -> "Normal".equalsIgnoreCase(b.getStatus())).count();
        long empty = all.stream().filter(b -> "Empty".equalsIgnoreCase(b.getStatus())).count();
        long req = all.stream().filter(b -> Boolean.TRUE.equals(b.getCollectionRequired())).count();
        double avg = total > 0 ? all.stream().mapToInt(Bin::getFillPercentage).average().orElse(0) : 0;

        return BinStatistics.builder()
                .totalBins(total)
                .criticalBins(critical)
                .highBins(high)
                .mediumBins(medium)
                .normalBins(normal)
                .emptyBins(empty)
                .collectionRequiredBins(req)
                .averageFillLevel(Math.round(avg * 10.0) / 10.0)
                .build();
    }

    public void saveTelemetryRecord(Bin bin) {
        Telemetry record = Telemetry.builder()
                .binId(bin.getId())
                .fillPercentage(bin.getFillPercentage())
                .batteryLevel(bin.getBatteryLevel())
                .temperature(bin.getTemperature())
                .timestamp(LocalDateTime.now())
                .build();
        telemetryRepository.save(record);
    }

    public BinResponse mapToResponse(Bin bin) {
        return BinResponse.builder()
                .id(bin.getId())
                .location(bin.getLocation())
                .area(bin.getArea())
                .latitude(bin.getLatitude())
                .longitude(bin.getLongitude())
                .capacity(bin.getCapacity())
                .wasteType(bin.getWasteType())
                .fillPercentage(bin.getFillPercentage())
                .fillLevel(bin.getFillPercentage()) // alias for UI
                .status(bin.getStatus())
                .batteryLevel(bin.getBatteryLevel())
                .temperature(bin.getTemperature())
                .lastUpdated(bin.getLastUpdated() != null ? bin.getLastUpdated() : "2 min ago")
                .collectionRequired(bin.getCollectionRequired())
                .priority(bin.getPriority())
                .sensorId(bin.getSensorId())
                .installedDate(bin.getInstalledDate())
                .build();
    }
}
