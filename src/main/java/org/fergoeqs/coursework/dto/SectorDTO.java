package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.enums.CategoryType;

public record SectorDTO(
        Long id,
        CategoryType category,
        Integer capacity,
        Integer occupancy,
        Boolean isAvailable
) {}
