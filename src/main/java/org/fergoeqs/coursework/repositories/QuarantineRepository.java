package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Quarantine;
import org.fergoeqs.coursework.models.enums.QuarantineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuarantineRepository extends JpaRepository<Quarantine, Long> {
    List<Quarantine> findQuarantinesBySectorId(Long sectorId);
    List<Quarantine> findByEndDateBeforeAndStatusNot(LocalDateTime date, QuarantineStatus status);
}
