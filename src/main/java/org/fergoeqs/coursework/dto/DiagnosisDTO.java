package org.fergoeqs.coursework.dto;

import java.time.LocalDateTime;

public record DiagnosisDTO(
        Long id,
        String name,
        String description,
        LocalDateTime date,
        Boolean contagious,
        String examinationPlan, //план обследования
        Long anamnesis
) {
}
