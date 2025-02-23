package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.BodyMarker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BodyMarkersRepository extends JpaRepository<BodyMarker, Long> {
}
