package com.ecoclean.collection;

import com.ecoclean.collection.client.BinClient;
import com.ecoclean.collection.dto.AssignDriverRequest;
import com.ecoclean.collection.dto.CollectionResponse;
import com.ecoclean.collection.dto.CreateCollectionRequest;
import com.ecoclean.collection.entity.Collection;
import com.ecoclean.collection.repository.CollectionRepository;
import com.ecoclean.collection.service.CollectionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CollectionServiceTest {

    @Mock
    private CollectionRepository collectionRepository;

    @Mock
    private BinClient binClient;

    @InjectMocks
    private CollectionService collectionService;

    private Collection sampleCol;

    @BeforeEach
    void setUp() {
        sampleCol = Collection.builder()
                .id("COL-001")
                .binId("BIN-001")
                .binLocation("42 Main St")
                .fillLevel(95)
                .priority("Critical")
                .assignedDriver("James Wilson")
                .assignedDriverId("DRV-001")
                .status("Assigned")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testStartCollection() {
        when(collectionRepository.findById("COL-001")).thenReturn(Optional.of(sampleCol));
        when(collectionRepository.save(any(Collection.class))).thenAnswer(i -> i.getArgument(0));

        CollectionResponse res = collectionService.startCollection("COL-001");

        assertNotNull(res);
        assertEquals("In-Progress", res.getStatus());
    }

    @Test
    void testCompleteCollectionCallsBinReset() {
        when(collectionRepository.findById("COL-001")).thenReturn(Optional.of(sampleCol));
        when(collectionRepository.save(any(Collection.class))).thenAnswer(i -> i.getArgument(0));

        CollectionResponse res = collectionService.completeCollection("COL-001");

        assertNotNull(res);
        assertEquals("Completed", res.getStatus());
        assertNotNull(res.getCompletedAt());
        verify(binClient, times(1)).resetAfterCollection("BIN-001");
    }

    @Test
    void testAssignDriver() {
        when(collectionRepository.findById("COL-001")).thenReturn(Optional.of(sampleCol));
        when(collectionRepository.save(any(Collection.class))).thenAnswer(i -> i.getArgument(0));

        CollectionResponse res = collectionService.assignDriver("COL-001", new AssignDriverRequest("DRV-002", "Raj Kumar"));

        assertNotNull(res);
        assertEquals("Assigned", res.getStatus());
        assertEquals("Raj Kumar", res.getAssignedDriver());
        assertEquals("DRV-002", res.getAssignedDriverId());
    }
}
