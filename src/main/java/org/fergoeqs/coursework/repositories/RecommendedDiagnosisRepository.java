package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.RecommendedDiagnosis;
import org.fergoeqs.coursework.models.enums.BodyPart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendedDiagnosisRepository extends JpaRepository<RecommendedDiagnosis, Long> {
    Optional<RecommendedDiagnosis> findByName(String name);

    @Query("SELECT d FROM RecommendedDiagnosis d JOIN d.symptoms s WHERE s.id = :symptomId")
    List<RecommendedDiagnosis> findBySymptomId(Long symptomId);

        @Query("SELECT d FROM RecommendedDiagnosis d " +
                "JOIN d.symptoms s " +
                "WHERE s.id IN :symptomIds " +
                "AND d.bodyPart = :bodyPart")
        List<RecommendedDiagnosis> findBySymptomsAndBodyPart(
                @Param("symptomIds") List<Long> symptomIds,
                @Param("bodyPart") BodyPart bodyPart);

}
