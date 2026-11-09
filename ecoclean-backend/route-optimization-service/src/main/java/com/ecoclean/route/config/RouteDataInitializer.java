package com.ecoclean.route.config;

import com.ecoclean.route.entity.Route;
import com.ecoclean.route.entity.RouteStop;
import com.ecoclean.route.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class RouteDataInitializer implements CommandLineRunner {

    @Autowired
    private RouteRepository routeRepository;

    @Override
    public void run(String... args) {
        if (routeRepository.count() > 0) return;

        List<Route> routes = new ArrayList<>();

        // Route 1 - RT-001
        Route r1 = Route.builder()
                .id("RT-001")
                .driverId("DRV-001")
                .driverName("James Wilson")
                .vehicleId("VH-001")
                .vehicle("Truck #T-101 (Ford F-650)")
                .date(LocalDateTime.now().toLocalDate().toString())
                .startLocation("EcoClean Municipal Central Depot")
                .totalDistance(18.4)
                .estimatedDuration(95)
                .numberOfStops(4)
                .status("In-Progress")
                .optimizationScore(96)
                .fuelSaved(4.2)
                .co2Reduced(12.8)
                .createdAt(LocalDateTime.now().minusHours(3))
                .stops(new ArrayList<>())
                .build();

        r1.getStops().addAll(Arrays.asList(
            createStop(r1, 1, "BIN-001", "42 Main Street", "Commercial District", 92, 40.7128, -74.0060, 2.1, "09:00 AM", "Collected"),
            createStop(r1, 2, "BIN-005", "55 Pine Lane", "Commercial District", 95, 40.7135, -74.0095, 1.4, "09:25 AM", "Collected"),
            createStop(r1, 3, "BIN-002", "15 Oak Avenue", "Market Square", 64, 40.7145, -74.0082, 1.8, "09:50 AM", "Pending"),
            createStop(r1, 4, "BIN-009", "95 Market Square", "Market Square", 88, 40.7150, -74.0075, 0.9, "10:15 AM", "Pending")
        ));
        routes.add(r1);

        // Route 2 - RT-002
        Route r2 = Route.builder()
                .id("RT-002")
                .driverId("DRV-002")
                .driverName("Raj Kumar")
                .vehicleId("VH-002")
                .vehicle("Truck #T-102 (Volvo Electric)")
                .date(LocalDateTime.now().toLocalDate().toString())
                .startLocation("EcoClean Municipal Central Depot")
                .totalDistance(14.8)
                .estimatedDuration(75)
                .numberOfStops(3)
                .status("Optimized")
                .optimizationScore(92)
                .fuelSaved(3.5)
                .co2Reduced(9.4)
                .createdAt(LocalDateTime.now().minusHours(1))
                .stops(new ArrayList<>())
                .build();

        r2.getStops().addAll(Arrays.asList(
            createStop(r2, 1, "BIN-008", "210 Tech Plaza", "University Campus", 82, 40.7170, -74.0050, 2.8, "10:00 AM", "Pending"),
            createStop(r2, 2, "BIN-013", "450 Academic Way", "University Campus", 55, 40.7190, -74.0040, 1.2, "10:25 AM", "Pending"),
            createStop(r2, 3, "BIN-004", "120 Elm Street", "Residential North", 78, 40.7160, -74.0020, 1.9, "10:50 AM", "Pending")
        ));
        routes.add(r2);

        // Route 3 - RT-003
        Route r3 = Route.builder()
                .id("RT-003")
                .driverId("DRV-003")
                .driverName("Marcus Vance")
                .vehicleId("VH-003")
                .vehicle("Compactor #C-103 (Mack LR)")
                .date(LocalDateTime.now().toLocalDate().toString())
                .startLocation("EcoClean Municipal Central Depot")
                .totalDistance(22.6)
                .estimatedDuration(110)
                .numberOfStops(4)
                .status("Completed")
                .optimizationScore(98)
                .fuelSaved(5.8)
                .co2Reduced(16.2)
                .createdAt(LocalDateTime.now().minusDays(1))
                .stops(new ArrayList<>())
                .build();

        r3.getStops().addAll(Arrays.asList(
            createStop(r3, 1, "BIN-006", "300 Harbor View", "Waterfront", 45, 40.7090, -74.0110, 3.1, "08:30 AM", "Collected"),
            createStop(r3, 2, "BIN-012", "180 Riverfront Drive", "Waterfront", 91, 40.7075, -74.0125, 1.5, "08:55 AM", "Collected"),
            createStop(r3, 3, "BIN-017", "29 Dockside Alley", "Waterfront", 30, 40.7085, -74.0135, 1.1, "09:20 AM", "Collected"),
            createStop(r3, 4, "BIN-010", "14 Industrial Parkway", "Industrial Zone", 60, 40.7050, -74.0150, 2.4, "09:45 AM", "Collected")
        ));
        routes.add(r3);

        routeRepository.saveAll(routes);
    }

    private RouteStop createStop(Route route, int seq, String binId, String loc, String area, int fill, double lat, double lng, double dist, String time, String status) {
        return RouteStop.builder()
                .route(route)
                .sequenceNumber(seq)
                .binId(binId)
                .location(loc)
                .area(area)
                .fillLevel(fill)
                .latitude(lat)
                .longitude(lng)
                .distanceFromPrevious(dist)
                .estimatedArrival(time)
                .status(status)
                .build();
    }
}
