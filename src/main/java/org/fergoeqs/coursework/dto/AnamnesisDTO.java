package org.fergoeqs.coursework.dto;

import java.time.LocalDate;

public record AnamnesisDTO(
    Long id,
    String name,
    String description,
    LocalDate date,
    Long pet
) {
}
