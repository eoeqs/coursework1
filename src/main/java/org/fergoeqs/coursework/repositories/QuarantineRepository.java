package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Quarantine;
import org.fergoeqs.coursework.models.enums.QuarantineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuarantineRepository extends JpaRepository<Quarantine, Long> {
    List<Quarantine> findQuarantinesBySectorId(Long sectorId);
    List<Quarantine> findByEndDateBeforeAndStatusNot(LocalDateTime date, QuarantineStatus status);
    List<Quarantine> findQuarantinesByPetId(Long petId);
    @Query("SELECT q FROM Quarantine q WHERE q.sector.id = :sectorId " +
            "AND (:status IS NULL OR q.status = :status)")
    Page<Quarantine> findQuarantinesBySectorIdAndStatus(
            @Param("sectorId") Long sectorId,
            @Param("status") QuarantineStatus status,
            Pageable pageable);

    @Query("SELECT DISTINCT q.reason FROM Quarantine q WHERE q.sector.id = :sectorId AND q.status = 'CURRENT'")
    List<String> findDistinctReasonsByCurrentStatus(@Param("sectorId") Long sectorId);
}
