package com.ecoclean.route;

import com.ecoclean.route.client.BinClient;
import com.ecoclean.route.dto.BinDto;
import com.ecoclean.route.dto.OptimizeRouteRequest;
import com.ecoclean.route.dto.RouteResponse;
import com.ecoclean.route.entity.Route;
import com.ecoclean.route.repository.RouteRepository;
import com.ecoclean.route.repository.RouteStopRepository;
import com.ecoclean.route.service.RouteOptimizationService;
import com.ecoclean.route.util.HaversineCalculator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RouteOptimizationServiceTest {

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private RouteStopRepository routeStopRepository;

    @Mock
    private BinClient binClient;

    @InjectMocks
    private RouteOptimizationService routeOptimizationService;

    @Test
    void testHaversineDistance() {
        // NYC Central Park to Battery Park ~8km
        double dist = HaversineCalculator.calculateDistance(40.785091, -73.968285, 40.703277, -74.017028);
        assertTrue(dist > 7.0 && dist < 12.0);
    }

    @Test
    void testOptimizeRouteNearestNeighbor() {
        BinDto b1 = BinDto.builder().id("BIN-001").location("Loc 1").latitude(40.7130).longitude(-74.0062).fillPercentage(90).build();
        BinDto b2 = BinDto.builder().id("BIN-002").location("Loc 2").latitude(40.7160).longitude(-74.0080).fillPercentage(80).build();

        when(binClient.getAllBins()).thenReturn(Arrays.asList(b1, b2));
        when(routeRepository.save(any(Route.class))).thenAnswer(i -> i.getArgument(0));

        OptimizeRouteRequest req = OptimizeRouteRequest.builder()
                .driverId("DRV-001")
                .driverName("James Wilson")
                .vehicle("Truck #T-101")
                .binIds(Arrays.asList("BIN-001", "BIN-002"))
                .build();

        RouteResponse res = routeOptimizationService.optimizeRoute(req);

        assertNotNull(res);
        assertEquals("Optimized", res.getStatus());
        assertEquals(2, res.getStops().size());
        assertTrue(res.getTotalDistance() > 0.0);
        assertTrue(res.getEstimatedDuration() > 0);
    }
}
