package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Long> {

    List<Treatment> findAllByPetIdAndIsCompletedFalse(Long petId);

    List<Treatment> findAllByPetId(Long petId);

}
