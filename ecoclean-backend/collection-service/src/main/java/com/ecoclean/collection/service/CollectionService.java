package com.ecoclean.collection.service;

import com.ecoclean.collection.client.BinClient;
import com.ecoclean.collection.client.NotificationClient;
import com.ecoclean.collection.dto.*;
import com.ecoclean.collection.entity.Collection;
import com.ecoclean.collection.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CollectionService {

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired(required = false)
    private BinClient binClient;

    @Autowired(required = false)
    private NotificationClient notificationClient;

    public List<CollectionResponse> getAllCollections(String status, String driverId) {
        List<Collection> list;
        if (status != null && !status.trim().isEmpty() && !"All".equalsIgnoreCase(status)) {
            list = collectionRepository.findByStatus(status);
        } else if (driverId != null && !driverId.trim().isEmpty()) {
            list = collectionRepository.findByAssignedDriverId(driverId);
        } else {
            list = collectionRepository.findAll();
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public CollectionResponse getCollectionById(String id) {
        Collection col = collectionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection not found with id: " + id));
        return mapToResponse(col);
    }

    public CollectionResponse createCollection(CreateCollectionRequest request) {
        String colId = "COL-" + String.format("%03d", collectionRepository.count() + 1);

        String binLoc = request.getBinLocation();
        Integer fillLvl = request.getFillLevel();
        if (binLoc == null || fillLvl == null) {
            try {
                if (binClient != null) {
                    BinResponse bin = binClient.getBinById(request.getBinId());
                    if (bin != null) {
                        binLoc = bin.getLocation();
                        fillLvl = bin.getFillPercentage();
                    }
                }
            } catch (Exception e) {
                System.err.println("Could not query bin info via Feign: " + e.getMessage());
            }
        }

        String driverName = request.getAssignedDriver() != null ? request.getAssignedDriver() : request.getDriverName();
        String driverId = request.getAssignedDriverId() != null ? request.getAssignedDriverId() : request.getDriverId();
        String initialStatus = (driverId != null && !driverId.trim().isEmpty()) ? "Assigned" : "Pending";

        String scheduledTime = request.getScheduledTime();
        if (scheduledTime == null && request.getDate() != null && request.getTime() != null) {
            scheduledTime = request.getDate() + "T" + request.getTime() + ":00Z";
        }

        Collection col = Collection.builder()
                .id(colId)
                .binId(request.getBinId())
                .binLocation(binLoc != null ? binLoc : "Main Sector")
                .fillLevel(fillLvl != null ? fillLvl : 85)
                .priority(request.getPriority() != null ? request.getPriority() : "High")
                .assignedDriver(driverName)
                .assignedDriverId(driverId)
                .scheduledDate(request.getDate() != null ? request.getDate() : LocalDateTime.now().toLocalDate().toString())
                .scheduledTime(scheduledTime != null ? scheduledTime : LocalDateTime.now().toString())
                .status(request.getStatus() != null ? request.getStatus() : initialStatus)
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .build();

        Collection saved = collectionRepository.save(col);

        // If driver assigned, dispatch driver notification
        if (driverName != null && !driverName.trim().isEmpty()) {
            notifyDriver(saved, "New Pickup Assigned: " + saved.getId(),
                    "You have been assigned to collect Bin " + saved.getBinId() + " at " + saved.getBinLocation() + " (" + saved.getFillLevel() + "% full).");
        }

        return mapToResponse(saved);
    }

    public CollectionResponse assignDriver(String id, AssignDriverRequest request) {
        Collection col = collectionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection not found with id: " + id));

        col.setAssignedDriverId(request.getDriverId());
        col.setAssignedDriver(request.getDriverName());
        col.setStatus("Assigned");
        col.setUpdatedAt(LocalDateTime.now());

        Collection saved = collectionRepository.save(col);

        notifyDriver(saved, "Pickup Task Assignment: " + saved.getId(),
                "Pickup task for Bin " + saved.getBinId() + " at " + saved.getBinLocation() + " has been assigned to you.");

        return mapToResponse(saved);
    }

    public CollectionResponse startCollection(String id) {
        Collection col = collectionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection not found with id: " + id));

        col.setStatus("In-Progress");
        col.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(collectionRepository.save(col));
    }

    public CollectionResponse completeCollection(String id) {
        Collection col = collectionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection not found with id: " + id));

        col.setStatus("Completed");
        col.setCompletedAt(LocalDateTime.now());
        col.setUpdatedAt(LocalDateTime.now());

        Collection saved = collectionRepository.save(col);

        // Trigger Bin Monitoring Service to reset bin fill level & clear collectionRequired
        try {
            if (binClient != null) {
                binClient.resetAfterCollection(saved.getBinId());
            }
        } catch (Exception e) {
            System.err.println("Could not trigger bin reset via Feign: " + e.getMessage());
        }

        // Notify Admin of completed pickup
        try {
            if (notificationClient != null) {
                notificationClient.sendNotification(NotificationEvent.builder()
                        .userRole("ADMIN")
                        .title("Collection Completed: " + saved.getId())
                        .message("Driver " + (saved.getAssignedDriver() != null ? saved.getAssignedDriver() : "Staff") +
                                " completed collection for Bin " + saved.getBinId() + " at " + saved.getBinLocation() + ".")
                        .type("SUCCESS")
                        .category("collection")
                        .build());
            }
        } catch (Exception e) {
            System.err.println("Could not dispatch completion notification: " + e.getMessage());
        }

        return mapToResponse(saved);
    }

    public CollectionResponse reschedule(String id, RescheduleRequest request) {
        Collection col = collectionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection not found with id: " + id));

        String newTime = request.getScheduledTime();
        if (newTime == null && request.getDate() != null && request.getTime() != null) {
            newTime = request.getDate() + "T" + request.getTime() + ":00Z";
        }
        if (newTime != null) {
            col.setScheduledTime(newTime);
        }
        if (request.getDate() != null) {
            col.setScheduledDate(request.getDate());
        }
        col.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(collectionRepository.save(col));
    }

    public CollectionResponse cancelCollection(String id) {
        Collection col = collectionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection not found with id: " + id));

        col.setStatus("Cancelled");
        col.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(collectionRepository.save(col));
    }

    public CollectionStatistics getStatistics() {
        List<Collection> all = collectionRepository.findAll();
        long total = all.size();
        long pending = all.stream().filter(c -> "Pending".equalsIgnoreCase(c.getStatus())).count();
        long assigned = all.stream().filter(c -> "Assigned".equalsIgnoreCase(c.getStatus())).count();
        long inProgress = all.stream().filter(c -> "In-Progress".equalsIgnoreCase(c.getStatus())).count();
        long completed = all.stream().filter(c -> "Completed".equalsIgnoreCase(c.getStatus())).count();
        long cancelled = all.stream().filter(c -> "Cancelled".equalsIgnoreCase(c.getStatus())).count();

        return CollectionStatistics.builder()
                .totalCollections(total)
                .pendingCollections(pending)
                .assignedCollections(assigned)
                .inProgressCollections(inProgress)
                .completedCollections(completed)
                .cancelledCollections(cancelled)
                .build();
    }

    private void notifyDriver(Collection col, String title, String message) {
        try {
            if (notificationClient != null) {
                notificationClient.sendNotification(NotificationEvent.builder()
                        .userRole("DRIVER")
                        .title(title)
                        .message(message)
                        .type("INFO")
                        .category("dispatch")
                        .build());
            }
        } catch (Exception e) {
            System.err.println("Could not dispatch driver notification: " + e.getMessage());
        }
    }

    public CollectionResponse mapToResponse(Collection col) {
        return CollectionResponse.builder()
                .id(col.getId())
                .binId(col.getBinId())
                .binLocation(col.getBinLocation())
                .fillLevel(col.getFillLevel())
                .priority(col.getPriority())
                .assignedDriver(col.getAssignedDriver())
                .assignedDriverId(col.getAssignedDriverId())
                .scheduledDate(col.getScheduledDate())
                .scheduledTime(col.getScheduledTime())
                .status(col.getStatus())
                .notes(col.getNotes())
                .createdAt(col.getCreatedAt())
                .updatedAt(col.getUpdatedAt())
                .completedAt(col.getCompletedAt())
                .build();
    }
}
