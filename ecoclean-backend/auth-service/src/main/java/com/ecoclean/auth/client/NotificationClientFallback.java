package com.ecoclean.auth.client;

import com.ecoclean.auth.dto.NotificationEvent;
import org.springframework.stereotype.Component;

@Component
public class NotificationClientFallback implements NotificationClient {
    @Override
    public void sendNotification(NotificationEvent event) {
        // Fallback gracefully if notification-service is not reachable
        System.out.println("[NotificationClientFallback] Could not deliver notification: " + event.getTitle());
    }
}
