package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.AppointmentDTO;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.Appointment;
import org.fergoeqs.coursework.models.Slot;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.repositories.AppointmentsRepository;
import org.fergoeqs.coursework.repositories.SlotsRepository;
import org.fergoeqs.coursework.repositories.PetsRepository;
import org.fergoeqs.coursework.utils.Mappers.AppointmentMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Transactional(readOnly = true)
@Service
public class AppointmentsService {
    private final AppointmentsRepository appointmentsRepository;
    private final SlotsRepository availableSlotsRepository;
    private final PetsRepository petsRepository;
    private final HealthUpdatesService healthUpdatesService;
    private final NotificationService notificationService;
    private final AppointmentMapper appointmentMapper;

    public AppointmentsService(AppointmentsRepository appointmentsRepository, SlotsRepository availableSlotsRepository,
                               PetsRepository petsRepository, AppointmentMapper appointmentMapper,
                               HealthUpdatesService healthUpdatesService, NotificationService notificationService) {
        this.appointmentsRepository = appointmentsRepository;
        this.availableSlotsRepository = availableSlotsRepository;
        this.petsRepository = petsRepository;
        this.healthUpdatesService = healthUpdatesService;
        this.notificationService = notificationService;
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

    public List<Appointment> getUpcomingVetAppointments(Long vetId) {
        return appointmentsRepository.findBySlotVetIdAndSlotDateGreaterThanEqual(vetId, LocalDate.now());
    }
    public List<Appointment> getUpcomingPetAppointments(Long petId) {
        return appointmentsRepository.findByPetIdAndSlotDateGreaterThanEqual(petId, LocalDate.now());
    }

    @Transactional
    public Appointment create(AppointmentDTO appointmentDTO) {
        Appointment appointment = new Appointment();
        Slot slot = availableSlotsRepository.findById(appointmentDTO.slotId()).orElse(null); //TODO: проверку добавить на Null
        Pet pet = petsRepository.findById(appointmentDTO.petId()).orElse(null);
        healthUpdatesService.saveWithAppointment(pet, appointmentDTO.description());
        return appointmentsRepository.save(appointmentMapper.appointmentDTOToAppointment(appointmentDTO)); //TODO: переписать триггер на занятие слота
    }

    @Transactional
    public void delete(Long id, String reason) {
        Appointment appointment = appointmentsRepository.findById(id).orElseThrow();
        sendNotification(appointment, "Your appointment has been cancelled by vet cause: " + reason);
        appointmentsRepository.deleteById(id); //TODO: переписать триггер на освобождение слота
    }

    @Transactional
    @Scheduled(cron = "0 0 9 * * *")
    public void sendNotification() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Appointment> upcomingAppointments = appointmentsRepository.findAppointmentsBySlotDate(tomorrow);

        for (Appointment appointment : upcomingAppointments) {
            String message = "Your pet " + appointment.getPet().getName() +  " has an appointment scheduled for tomorrow at " + appointment.getSlot().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"));
            sendNotification(appointment, message);
        }
    }


    private void sendNotification(Appointment appointment, String message) {
        AppUser owner = appointment.getPet().getOwner();
        notificationService.sendNotification(owner.getId(), message, owner.getEmail());
    }


}
