package com.ecoclean.notification;

import com.ecoclean.notification.dto.NotificationRequest;
import com.ecoclean.notification.dto.NotificationResponse;
import com.ecoclean.notification.entity.Notification;
import com.ecoclean.notification.repository.NotificationRepository;
import com.ecoclean.notification.service.NotificationService;
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
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void testCreateNotification() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> {
            Notification n = i.getArgument(0);
            n.setId(1L);
            return n;
        });

        NotificationRequest req = NotificationRequest.builder()
                .userRole("ADMIN")
                .title("Critical Bin")
                .message("Bin 001 critical")
                .type("CRITICAL")
                .build();

        NotificationResponse res = notificationService.createNotification(req);

        assertNotNull(res);
        assertEquals("critical", res.getType());
        assertEquals("Critical Bin", res.getTitle());
    }

    @Test
    void testMarkAsRead() {
        Notification n = Notification.builder()
                .id(5L)
                .title("Test")
                .message("Test")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(notificationRepository.findById(5L)).thenReturn(Optional.of(n));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArgument(0));

        NotificationResponse res = notificationService.markAsRead(5L);

        assertTrue(res.getRead());
    }
}
