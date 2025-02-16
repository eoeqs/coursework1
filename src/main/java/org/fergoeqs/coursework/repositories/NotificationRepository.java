package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByAppUserId(Long userId);
}
