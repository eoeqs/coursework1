package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.HealthUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthUpdatesRepository extends JpaRepository<HealthUpdate, Long> {
    List<HealthUpdate> findAllByPetId(Long petId);
    HealthUpdate findFirstByPetIdOrderByIdDesc(Long petId);
}
