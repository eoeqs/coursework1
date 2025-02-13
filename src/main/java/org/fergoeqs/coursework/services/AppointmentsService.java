package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.AppointmentDTO;
import org.fergoeqs.coursework.models.Appointment;
import org.fergoeqs.coursework.models.Slot;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.repositories.AppointmentsRepository;
import org.fergoeqs.coursework.repositories.SlotsRepository;
import org.fergoeqs.coursework.repositories.PetsRepository;
import org.fergoeqs.coursework.utils.Mappers.AppointmentMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Service
public class AppointmentsService {
    private final AppointmentsRepository appointmentsRepository;
    private final SlotsRepository availableSlotsRepository;
    private final PetsRepository petsRepository;
    private final HealthUpdatesService healthUpdatesService;
    private final AppointmentMapper appointmentMapper;

    public AppointmentsService(AppointmentsRepository appointmentsRepository, SlotsRepository availableSlotsRepository,
                               PetsRepository petsRepository, AppointmentMapper appointmentMapper,
                               HealthUpdatesService healthUpdatesService) {
        this.appointmentsRepository = appointmentsRepository;
        this.availableSlotsRepository = availableSlotsRepository;
        this.petsRepository = petsRepository;
        this.healthUpdatesService = healthUpdatesService;
        this.appointmentMapper = appointmentMapper;
    }

    public List<Appointment> findAll() {
        return appointmentsRepository.findAll();
    }

    public Appointment findById(Long id) {
        return appointmentsRepository.findById(id).orElse(null);
    }

    public List<Appointment> findByVetId(Long vetId) {
        return appointmentsRepository.findBySlot_VetId(vetId);
    }

    @Transactional
    public void create(AppointmentDTO appointmentDTO) {
        Appointment appointment = new Appointment();
        Slot slot = availableSlotsRepository.findById(appointmentDTO.slotId()).orElse(null); //TODO: проверку добавить на Null
        Pet pet = petsRepository.findById(appointmentDTO.petId()).orElse(null);
        healthUpdatesService.saveWithAppointment(pet, appointmentDTO.description());
        appointmentsRepository.save(appointmentMapper.appointmentDTOToAppointment(appointmentDTO)); //TODO: переписать триггер на занятие слота
    }

    @Transactional
    public void delete(Long id) {
        appointmentsRepository.deleteById(id); //TODO: переписать триггер на освобождение слота
    }

}
