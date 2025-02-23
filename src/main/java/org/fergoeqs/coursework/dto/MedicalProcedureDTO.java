package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.enums.ProcedureType;

import java.time.LocalDateTime;

public record MedicalProcedureDTO (
    Long id,
    ProcedureType type,
    String name,
    LocalDateTime date,
    String description,
    String notes,
    Long pet,
    Long vet,
    String reportUrl,
    Long anamnesis)
{}