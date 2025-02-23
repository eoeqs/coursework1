package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.BodyMarker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BodyMarkersRepository extends JpaRepository<BodyMarker, Long> {
    Optional<BodyMarker> findByAppointmentId(Long appointmentId);

}
