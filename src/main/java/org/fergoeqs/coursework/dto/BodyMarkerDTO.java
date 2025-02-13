package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.enums.BodyPart;

public record BodyMarkerDTO(
        Long id,
        Integer positionX,
        Integer positionY,
        BodyPart bodyPart,
        Long pet,
        Long appointment
) {
}
