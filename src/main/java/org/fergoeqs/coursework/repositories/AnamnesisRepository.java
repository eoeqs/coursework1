package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Anamnesis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnamnesisRepository extends JpaRepository<Anamnesis, Long> {
    List<Anamnesis> findByPetId(Long petId);
}
