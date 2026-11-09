package com.ecoclean.bin.controller;

import com.ecoclean.bin.dto.*;
import com.ecoclean.bin.service.BinService;
import com.ecoclean.bin.service.TelemetrySimulator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bins")
public class BinController {

    @Autowired
    private BinService binService;

    @Autowired
    private TelemetrySimulator telemetrySimulator;

    @GetMapping
    public ResponseEntity<List<BinResponse>> getAllBins() {
        return ResponseEntity.ok(binService.getAllBins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BinResponse> getBinById(@PathVariable String id) {
        return ResponseEntity.ok(binService.getBinById(id));
    }

    @PostMapping
    public ResponseEntity<BinResponse> createBin(@RequestBody BinRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(binService.createBin(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BinResponse> updateBin(@PathVariable String id, @RequestBody BinRequest request) {
        return ResponseEntity.ok(binService.updateBin(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBin(@PathVariable String id) {
        binService.deleteBin(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/telemetry")
    public ResponseEntity<List<TelemetryResponse>> getTelemetryForBin(@PathVariable String id) {
        return ResponseEntity.ok(binService.getTelemetryForBin(id));
    }

    @PostMapping("/simulate-pulse")
    public ResponseEntity<List<BinResponse>> simulatePulse() {
        telemetrySimulator.triggerTelemetryPulse();
        return ResponseEntity.ok(binService.getAllBins());
    }

    @PutMapping("/{id}/mark-for-collection")
    public ResponseEntity<BinResponse> markForCollection(@PathVariable String id) {
        return ResponseEntity.ok(binService.markForCollection(id));
    }

    @PutMapping("/{id}/reset-after-collection")
    public ResponseEntity<BinResponse> resetAfterCollection(@PathVariable String id) {
        return ResponseEntity.ok(binService.resetAfterCollection(id));
    }

    @GetMapping("/statistics")
    public ResponseEntity<BinStatistics> getStatistics() {
        return ResponseEntity.ok(binService.getStatistics());
    }
}
