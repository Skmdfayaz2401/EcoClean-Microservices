package com.ecoclean.collection.client;

import com.ecoclean.collection.dto.NotificationEvent;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "NOTIFICATION-SERVICE", fallback = NotificationClientFallback.class)
public interface NotificationClient {
    @PostMapping("/api/notifications")
    void sendNotification(@RequestBody NotificationEvent event);
}

@Component
class NotificationClientFallback implements NotificationClient {
    @Override
    public void sendNotification(NotificationEvent event) {
        System.out.println("[CollectionService -> NotificationFallback] Could not deliver notification: " + event.getTitle());
    }
}
