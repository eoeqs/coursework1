package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.AppointmentDTO;
import org.fergoeqs.coursework.models.Appointment;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.repositories.AppointmentsRepository;
import org.springframework.stereotype.Service;

@Service
public class AppointmentsService {
    private final AppointmentsRepository appointmentsRepository;

    public AppointmentsService(AppointmentsRepository appointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public void create(AppointmentDTO appointmentDTO, Pet pet) {
        Appointment appointment = new Appointment();
        appointment.setPriority(appointmentDTO.getPriority());
        appointment.setPet(pet);
        appointment.setSlot(appointmentDTO.getSlot());
        appointmentsRepository.save(appointment); //TODO: переписать триггер на занятие слота
    }

    public void delete(Long id) {
        appointmentsRepository.deleteById(id); //TODO: переписать триггер на освобождение слота
    }

}
