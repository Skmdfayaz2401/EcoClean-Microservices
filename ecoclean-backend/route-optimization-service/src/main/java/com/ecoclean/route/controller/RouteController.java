package com.ecoclean.route.controller;

import com.ecoclean.route.dto.OptimizeRouteRequest;
import com.ecoclean.route.dto.RouteResponse;
import com.ecoclean.route.service.RouteOptimizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RouteOptimizationService routeService;

    @GetMapping
    public ResponseEntity<List<RouteResponse>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteResponse> getRouteById(@PathVariable("id") String id) {
        return ResponseEntity.ok(routeService.getRouteById(id));
    }

    @PostMapping("/optimize")
    public ResponseEntity<RouteResponse> optimizeRoute(@RequestBody OptimizeRouteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(routeService.optimizeRoute(request));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<RouteResponse> startRoute(@PathVariable("id") String id) {
        return ResponseEntity.ok(routeService.updateRouteStatus(id, "In-Progress"));
    }

    @PutMapping("/{id}/pause")
    public ResponseEntity<RouteResponse> pauseRoute(@PathVariable("id") String id) {
        return ResponseEntity.ok(routeService.updateRouteStatus(id, "Paused"));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<RouteResponse> completeRoute(@PathVariable("id") String id) {
        return ResponseEntity.ok(routeService.updateRouteStatus(id, "Completed"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RouteResponse> updateStatus(@PathVariable("id") String id, @RequestParam("status") String status) {
        return ResponseEntity.ok(routeService.updateRouteStatus(id, status));
    }

    @PutMapping("/{id}/stops/{stopNumber}/status")
    public ResponseEntity<RouteResponse> updateStopStatus(
            @PathVariable("id") String id,
            @PathVariable("stopNumber") Integer stopNumber,
            @RequestParam("status") String status) {
        return ResponseEntity.ok(routeService.updateStopStatus(id, stopNumber, status));
    }
}
