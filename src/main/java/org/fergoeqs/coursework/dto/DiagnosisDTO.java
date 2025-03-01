package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.enums.BodyPart;

import java.time.LocalDateTime;
import java.util.List;

public record DiagnosisDTO(
        Long id,
        String name,
        String description,
        LocalDateTime date,
        Boolean contagious,
        String examinationPlan, //план обследования
        Long anamnesis,
        BodyPart bodyPart,
        List<Long> symptoms
) {
}
