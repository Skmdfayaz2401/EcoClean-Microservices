package com.ecoclean.collection.controller;

import com.ecoclean.collection.dto.*;
import com.ecoclean.collection.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    @Autowired
    private CollectionService collectionService;

    @GetMapping
    public ResponseEntity<List<CollectionResponse>> getAllCollections(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "driverId", required = false) String driverId) {
        return ResponseEntity.ok(collectionService.getAllCollections(status, driverId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionResponse> getCollectionById(@PathVariable("id") String id) {
        return ResponseEntity.ok(collectionService.getCollectionById(id));
    }

    @PostMapping
    public ResponseEntity<CollectionResponse> createCollection(@RequestBody CreateCollectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(collectionService.createCollection(request));
    }

    @PutMapping("/{id}/assign-driver")
    public ResponseEntity<CollectionResponse> assignDriver(@PathVariable("id") String id, @RequestBody AssignDriverRequest request) {
        return ResponseEntity.ok(collectionService.assignDriver(id, request));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<CollectionResponse> startCollection(@PathVariable("id") String id) {
        return ResponseEntity.ok(collectionService.startCollection(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<CollectionResponse> completeCollection(@PathVariable("id") String id) {
        return ResponseEntity.ok(collectionService.completeCollection(id));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<CollectionResponse> reschedule(@PathVariable("id") String id, @RequestBody RescheduleRequest request) {
        return ResponseEntity.ok(collectionService.reschedule(id, request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<CollectionResponse> cancelCollection(@PathVariable("id") String id) {
        return ResponseEntity.ok(collectionService.cancelCollection(id));
    }

    @GetMapping("/statistics")
    public ResponseEntity<CollectionStatistics> getStatistics() {
        return ResponseEntity.ok(collectionService.getStatistics());
    }
}
