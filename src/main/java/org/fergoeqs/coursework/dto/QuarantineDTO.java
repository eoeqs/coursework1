package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.enums.QuarantineStatus;

import java.time.LocalDateTime;

public record QuarantineDTO(
        Long id,
        String reason,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        QuarantineStatus status,
        Long sector,
        Long pet) {
}
