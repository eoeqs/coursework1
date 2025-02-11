package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.enums.BodyPart;

import java.util.List;

public record RecommendedDiagnosisDTO(
    Long id,
    String name,
    String description,
    Boolean contagious,
    BodyPart bodyPart,
    List<Long> symptoms) {}
