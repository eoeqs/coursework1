package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentsRepository extends JpaRepository<Appointment, Long> {
}
