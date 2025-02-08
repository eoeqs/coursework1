package org.fergoeqs.coursework.controllers;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.AppointmentDTO;
import org.fergoeqs.coursework.models.Appointment;
import org.fergoeqs.coursework.services.AppointmentsService;
import org.fergoeqs.coursework.utils.AppointmentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/all")
    public ResponseEntity<?> getAllAppointments() {
        try {
            return ResponseEntity.ok(appointmentMapper.appointmentsToAppointmentDTOs(appointmentsService.findAll()));
        } catch (Exception e) {
            logger.error("Error getting all appointments: {}", e.getMessage());
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

    @PostMapping("/new-appointment")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO appointmentDTO) throws BadRequestException {
        try {
            if (appointmentDTO == null) {
                throw new BadRequestException("Appointment data is invalid.");
            }
            appointmentsService.create(appointmentDTO);
            return ResponseEntity.ok(appointmentDTO); //TODO: выводить окно с датой записи
        } catch (Exception e) {
            logger.error("Error creating appointment: {}", e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/cancel-appointment/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            appointmentsService.delete(id);
            return ResponseEntity.ok("Appointment " + id + " canceled");
        } catch (Exception e) {
            logger.error("Error cancelling appointment: {}", e.getMessage());
            throw e;
        }
    }
}