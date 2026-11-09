package com.ecoclean.auth.client;

import com.ecoclean.auth.dto.NotificationEvent;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "NOTIFICATION-SERVICE", fallback = NotificationClientFallback.class)
public interface NotificationClient {
    @PostMapping("/api/notifications")
    void sendNotification(@RequestBody NotificationEvent event);
}
