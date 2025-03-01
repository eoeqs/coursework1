package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Report findReportByAnamnesisId(Long anamnesis);
}
