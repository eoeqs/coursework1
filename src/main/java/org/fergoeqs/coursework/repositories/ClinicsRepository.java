package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicsRepository extends JpaRepository<Clinic, Long> {
}
