package org.fergoeqs.coursework.dto;

import java.time.LocalDateTime;

public record NotificationDTO(
    Long id,
    LocalDateTime dateTime,
    String content,
    Long appUser) {
}
