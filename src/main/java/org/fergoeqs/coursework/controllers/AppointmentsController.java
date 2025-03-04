package org.fergoeqs.coursework.controllers;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.AppointmentDTO;
import org.fergoeqs.coursework.models.Appointment;
import org.fergoeqs.coursework.services.AppointmentsService;
import org.fergoeqs.coursework.utils.Mappers.AppointmentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentsController {

    private final AppointmentsService appointmentsService;
    private final AppointmentMapper appointmentMapper;
    private static final Logger logger = LoggerFactory.getLogger(AppointmentsController.class);

    public AppointmentsController(AppointmentsService appointmentsService, AppointmentMapper appointmentMapper) {
        this.appointmentsService = appointmentsService;
        this.appointmentMapper = appointmentMapper;
    }

    @GetMapping("/appointment/{id}")
    public ResponseEntity<?> getAppointment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(appointmentMapper.appointmentToAppointmentDTO(appointmentsService.findById(id)));
        } catch (Exception e) {
            logger.error("Error getting appointment: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/today-queue")
    public ResponseEntity<?> getTodayAppointments() {
        try {
            return ResponseEntity.ok(appointmentsService.findTodayQueue());
        } catch (Exception e) {
            logger.error("Error getting today appointments: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAppointments() {
        try {
            return ResponseEntity.ok(appointmentMapper.appointmentsToAppointmentDTOs(appointmentsService.findAll()));
        } catch (Exception e) {
            logger.error("Error getting all appointments: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/without-anamnesis")
    public ResponseEntity<?> getAppointmentsWithoutAnamnesis() {
        try {
            return ResponseEntity.ok(appointmentMapper.appointmentsToAppointmentDTOs(appointmentsService.findAppointmentsWithoutAnamnesis()));
        } catch (Exception e) {
            logger.error("Error getting appointments without anamnesis: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/vet-appointments/{vetId}")
    public ResponseEntity<?> getVetAppointments(@PathVariable Long vetId) {
        try {
            List<Appointment> appointments = appointmentsService.findByVetId(vetId);
            return ResponseEntity.ok(appointmentMapper.appointmentsToAppointmentDTOs(appointments));
        } catch (Exception e) {
            logger.error("Error getting vet appointments: {}", e.getMessage());
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @GetMapping("upcoming-vet/{vetId}")
    public ResponseEntity<?> getUpcomingVetAppointments(@PathVariable Long vetId) {
        try {
            List<Appointment> appointments = appointmentsService.getUpcomingVetAppointments(vetId);
            return ResponseEntity.ok(appointmentMapper.appointmentsToAppointmentDTOs(appointments));
        } catch (Exception e) {
            logger.error("Error getting upcoming vet's appointments: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("upcoming-pet/{petId}")
    public ResponseEntity<?> getUpcomingPetAppointments(@PathVariable Long petId) {
        try {
            List<Appointment> appointments = appointmentsService.getUpcomingPetAppointments(petId);
            return ResponseEntity.ok(appointmentMapper.appointmentsToAppointmentDTOs(appointments));
        } catch (Exception e) {
            logger.error("Error getting upcoming pet's appointments: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/new-appointment")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO appointmentDTO) throws BadRequestException {
        try {
            if (appointmentDTO == null) {
                throw new BadRequestException("Appointment data is invalid.");
            }

            return ResponseEntity.ok(appointmentMapper.appointmentToAppointmentDTO(appointmentsService.create(appointmentDTO))); //TODO: выводить окно с датой записи
        } catch (Exception e) {
            logger.error("Error creating appointment: {}", e.getMessage());
            throw e;
        }
    }

    @PutMapping("/update-appointment/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestParam Long slotId) {
        try {
            return ResponseEntity.ok(appointmentMapper.appointmentToAppointmentDTO(appointmentsService.update(id, slotId)));
        } catch (Exception e) {
            logger.error("Error updating appointment: {}", e.getMessage());
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @DeleteMapping("/cancel-appointment/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, @RequestBody String reason) {
        try {
            appointmentsService.delete(id, reason);
            return ResponseEntity.ok("Appointment " + id + " canceled");
        } catch (Exception e) {
            logger.error("Error cancelling appointment: {}", e.getMessage());
            throw e;
        }
    }
}