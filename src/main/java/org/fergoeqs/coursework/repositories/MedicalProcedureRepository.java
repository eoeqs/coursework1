package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.MedicalProcedure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalProcedureRepository extends JpaRepository<MedicalProcedure, Long> {
    List<MedicalProcedure> findAllByPetId(Long petId);
    List<MedicalProcedure> findAllByAnamnesisId(Long anamnesisId);
}
