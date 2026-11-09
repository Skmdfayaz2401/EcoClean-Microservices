package com.ecoclean.notification.repository;

import com.ecoclean.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByOrderByCreatedAtDesc();
    List<Notification> findByUserRoleOrUserRoleOrderByCreatedAtDesc(String role1, String role2);
    List<Notification> findByTypeIgnoreCaseOrderByCreatedAtDesc(String type);
    long countByReadFalse();
}
