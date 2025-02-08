package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentsRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findBySlot_VetId(Long vetId);
}
