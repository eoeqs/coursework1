package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SymptomsRepository extends JpaRepository<Symptom, Long>{
    Optional<Symptom> findByName(String name);
}
