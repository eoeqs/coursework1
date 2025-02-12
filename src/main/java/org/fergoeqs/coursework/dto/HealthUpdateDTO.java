package org.fergoeqs.coursework.dto;
import java.time.LocalDateTime;

public record HealthUpdateDTO(
       Long id,
       LocalDateTime date,
       String symptoms,
       String notes,
       boolean dynamics,
       Long pet
) {
}
