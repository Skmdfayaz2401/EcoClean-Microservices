package com.ecoclean.bin;

import com.ecoclean.bin.dto.BinResponse;
import com.ecoclean.bin.dto.BinStatistics;
import com.ecoclean.bin.entity.Bin;
import com.ecoclean.bin.repository.BinRepository;
import com.ecoclean.bin.repository.TelemetryRepository;
import com.ecoclean.bin.service.BinService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BinServiceTest {

    @Mock
    private BinRepository binRepository;

    @Mock
    private TelemetryRepository telemetryRepository;

    @InjectMocks
    private BinService binService;

    private Bin binCritical;
    private Bin binNormal;

    @BeforeEach
    void setUp() {
        binCritical = Bin.builder()
                .id("BIN-001")
                .location("42 Main Street")
                .area("Commercial District")
                .fillPercentage(95)
                .status("Critical")
                .collectionRequired(true)
                .priority("Critical")
                .build();

        binNormal = Bin.builder()
                .id("BIN-002")
                .location("15 Oak Ave")
                .area("Market Square")
                .fillPercentage(40)
                .status("Normal")
                .collectionRequired(false)
                .priority("Low")
                .build();
    }

    @Test
    void testGetAllBins() {
        when(binRepository.findAll()).thenReturn(Arrays.asList(binCritical, binNormal));

        List<BinResponse> bins = binService.getAllBins();

        assertEquals(2, bins.size());
        assertEquals("BIN-001", bins.get(0).getId());
        assertEquals(95, bins.get(0).getFillPercentage());
    }

    @Test
    void testResetAfterCollection() {
        when(binRepository.findById("BIN-001")).thenReturn(Optional.of(binCritical));
        when(binRepository.save(any(Bin.class))).thenAnswer(i -> i.getArgument(0));

        BinResponse reset = binService.resetAfterCollection("BIN-001");

        assertNotNull(reset);
        assertTrue(reset.getFillPercentage() <= 15);
        assertFalse(reset.getCollectionRequired());
        assertEquals("Normal", reset.getStatus());
        assertEquals("Low", reset.getPriority());
    }

    @Test
    void testGetStatistics() {
        when(binRepository.findAll()).thenReturn(Arrays.asList(binCritical, binNormal));

        BinStatistics stats = binService.getStatistics();

        assertEquals(2, stats.getTotalBins());
        assertEquals(1, stats.getCriticalBins());
        assertEquals(1, stats.getNormalBins());
        assertEquals(1, stats.getCollectionRequiredBins());
    }
}
