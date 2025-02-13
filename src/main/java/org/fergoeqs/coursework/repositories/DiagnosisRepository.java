package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
    @Query("SELECT d FROM Diagnosis d " +
            "JOIN d.anamnesis a " +
            "WHERE a.pet.id = :petId")
    List<Diagnosis> findByPetId(@Param("petId") Long petId);

    @Query("SELECT d FROM Diagnosis d " +
            "JOIN d.anamnesis a " +
            "WHERE a.pet.id = :petId " +
            "ORDER BY d.date ASC")
    Optional<Diagnosis> findFirstDiagnosisByPetId(@Param("petId") Long petId); //для предварительного

    @Query("SELECT d FROM Diagnosis d " +
            "JOIN d.anamnesis a " +
            "WHERE a.pet.id = :petId " +
            "AND d.date > (SELECT MIN(d2.date) FROM Diagnosis d2 JOIN d2.anamnesis a2 WHERE a2.pet.id = :petId) " +
            "ORDER BY d.date ASC")
    List<Diagnosis> findAllExceptFirstDiagnosisByPetId(@Param("petId") Long petId); //для остальных диагнозов

    @Query("SELECT d FROM Diagnosis d " +
            "JOIN d.anamnesis a " +
            "WHERE a.id = :anamnesisId " +
            "ORDER BY d.date ASC")
    List<Diagnosis> findByAnamnesisId(@Param("anamnesisId") Long anamnesisId);

    @Query("SELECT d FROM Diagnosis d " +
            "JOIN d.anamnesis a " +
            "WHERE a.id = :anamnesisId " +
            "ORDER BY d.date ASC")
    Optional<Diagnosis> findFirstDiagnosisByAnamnesisId(@Param("anamnesisId") Long anamnesisId);

    @Query("SELECT d FROM Diagnosis d " +
            "JOIN d.anamnesis a " +
            "WHERE a.id = :anamnesisId " +
            "AND d.date > (SELECT MIN(d2.date) FROM Diagnosis d2 JOIN d2.anamnesis a2 WHERE a2.id = :anamnesisId) " +
            "ORDER BY d.date ASC")
    List<Diagnosis> findAllExceptFirstDiagnosisByAnamnesisId(@Param("anamnesisId") Long anamnesisId);

}
