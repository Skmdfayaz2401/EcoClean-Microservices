package com.ecoclean.notification.service;

import com.ecoclean.notification.dto.NotificationRequest;
import com.ecoclean.notification.dto.NotificationResponse;
import com.ecoclean.notification.entity.Notification;
import com.ecoclean.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<NotificationResponse> getAllNotifications(String role, String type) {
        List<Notification> list;

        if (type != null && !type.trim().isEmpty() && !"All".equalsIgnoreCase(type)) {
            list = notificationRepository.findByTypeIgnoreCaseOrderByCreatedAtDesc(type);
        } else if (role != null && !role.trim().isEmpty()) {
            list = notificationRepository.findByUserRoleOrUserRoleOrderByCreatedAtDesc(role.toUpperCase(), "ALL");
        } else {
            list = notificationRepository.findAllByOrderByCreatedAtDesc();
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .userRole(request.getUserRole() != null ? request.getUserRole().toUpperCase() : "ALL")
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType() != null ? request.getType().toLowerCase() : "info")
                .category(request.getCategory() != null ? request.getCategory() : "system")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        notification.setRead(true);
        return mapToResponse(notificationRepository.save(notification));
    }

    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findAll();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void clearAll() {
        notificationRepository.deleteAll();
    }

    public long getUnreadCount() {
        return notificationRepository.countByReadFalse();
    }

    public NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .userRole(n.getUserRole())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .category(n.getCategory())
                .read(n.getRead())
                .timestamp(n.getCreatedAt().toString())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
