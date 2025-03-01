package org.fergoeqs.coursework.dto;

import java.time.LocalDateTime;

public record DiagnosticAttachmentDTO(
        Long id,
        String name,
        String description,
        String fileUrl,
        LocalDateTime uploadDate,
        Long anamnesis,
        Long diagnosis) {
}