package org.fergoeqs.coursework.dto;

public record TreatmentDTO(
        Long id,
        String name,
        String description,
        String prescribedMedication,
        String duration,
        Long diagnosis,
        Long pet,
        Boolean isCompleted
) { }
