package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.AppointmentDTO;
import org.fergoeqs.coursework.models.Appointment;
import org.fergoeqs.coursework.models.AvailableSlots;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.repositories.AppointmentsRepository;
import org.fergoeqs.coursework.repositories.AvailableSlotsRepository;
import org.fergoeqs.coursework.repositories.PetsRepository;
import org.springframework.stereotype.Service;

@Service
public class AppointmentsService {
    private final AppointmentsRepository appointmentsRepository;
    private final AvailableSlotsRepository availableSlotsRepository;
    private final PetsRepository petsRepository;

    public AppointmentsService(AppointmentsRepository appointmentsRepository, AvailableSlotsRepository availableSlotsRepository,
                               PetsRepository petsRepository) {
        this.appointmentsRepository = appointmentsRepository;
        this.availableSlotsRepository = availableSlotsRepository;
        this.petsRepository = petsRepository;

    }

    public void create(AppointmentDTO appointmentDTO) {
        Appointment appointment = new Appointment();
        AvailableSlots slot = availableSlotsRepository.findById(appointmentDTO.slotId()).orElse(null); //TODO: проверку добавить на Null
        Pet pet = petsRepository.findById(appointmentDTO.petId()).orElse(null);
        appointment.setPriority(appointmentDTO.priority());
        appointment.setPet(pet);
        appointment.setSlot(slot);
        appointmentsRepository.save(appointment); //TODO: переписать триггер на занятие слота
    }

    public void delete(Long id) {
        appointmentsRepository.deleteById(id); //TODO: переписать триггер на освобождение слота
    }

}
