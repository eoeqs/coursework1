package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentsRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findBySlot_VetId(Long vetId);
    List<Appointment> findAppointmentsBySlotDate(LocalDate date);
    List<Appointment> findByPetIdAndSlotDateGreaterThanEqual(Long petId, LocalDate currentDate);
    List<Appointment> findBySlotVetIdAndSlotDateGreaterThanEqual(Long vetId, LocalDate currentDate);
    @Query("SELECT COUNT(a) > 0 FROM Appointment a " +
            "WHERE a.pet.owner.id = :ownerId AND a.slot.vet.id = :vetId")
    boolean existsByOwnerAndVet(@Param("ownerId") Long ownerId, @Param("vetId") Long vetId);

    @Query("SELECT a FROM Appointment a LEFT JOIN Anamnesis an ON a.id = an.appointment.id WHERE an.id IS NULL")
    List<Appointment> findAppointmentsWithoutAnamnesis();
}
