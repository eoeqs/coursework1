package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.services.NotificationService;
import org.fergoeqs.coursework.utils.Mappers.NotificationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    public NotificationController(NotificationService notificationService, NotificationMapper notificationMapper) {
        this.notificationService = notificationService;
        this.notificationMapper = notificationMapper;

    }

    @GetMapping("all/{userId}")
    public ResponseEntity<?> getAllNotifications(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(notificationMapper.toDTOs(notificationService.findAllByUserId(userId)));
        } catch (Exception e) {
            logger.error("Error getting notifications: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("notification/{id}")
    public ResponseEntity<?> getNotification(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(notificationMapper.toDTO(notificationService.findById(id)));
        } catch (Exception e) {
            logger.error("Error getting notification: {}", e.getMessage());
            throw e;
        }
    }

}
