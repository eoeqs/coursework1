package org.fergoeqs.coursework.controllers;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.AppointmentDTO;
import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.exception.UnauthorizedAccessException;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.services.AppointmentsService;
import org.fergoeqs.coursework.services.PetsService;
import org.fergoeqs.coursework.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pets")
public class PetsController {
    private final PetsService petsService;
    private final UserService userService;
    private final AppointmentsService appointmentsService;
    private static final Logger logger = LoggerFactory.getLogger(PetsController.class);

    public PetsController (PetsService petsService, UserService userService, AppointmentsService appointmentsService) {
        this.petsService = petsService;
        this.userService = userService;
        this.appointmentsService = appointmentsService;
    }

    @PostMapping("/new-appointment")
    public ResponseEntity<?> createAppointment(@RequestBody PetDTO petDTO,
                                               @RequestBody AppointmentDTO appointmentDTO) throws BadRequestException {
        try {
            Pet pet = petsService.addPet(petDTO, userService.getAuthenticatedUser().getId());
            appointmentsService.create(appointmentDTO, pet);
            return ResponseEntity.ok(appointmentDTO); //TODO: выводить окно с датой записи
        } catch (Exception e) {
            logger.error("Appointment failed: {}", e.getMessage());
            throw new UnauthorizedAccessException("Appointment failed");
        }
    }

}
