package org.fergoeqs.coursework.dto;

public record ReportDTO(
        String finalDiagnosis,
        String finalCondition,
        String recommendations,
        String additionalObservations,
        String ownerRemarks,
        String nextExaminationDate) {
}
