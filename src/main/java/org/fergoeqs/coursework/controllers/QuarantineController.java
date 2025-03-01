package org.fergoeqs.coursework.controllers;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.QuarantineDTO;
import org.fergoeqs.coursework.models.Quarantine;
import org.fergoeqs.coursework.models.enums.QuarantineStatus;
import org.fergoeqs.coursework.services.QuarantineService;
import org.fergoeqs.coursework.services.UserService;
import org.fergoeqs.coursework.utils.Mappers.QuarantineMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quarantine")
public class QuarantineController {
    private final QuarantineService quarantineService;
    private final QuarantineMapper quarantineMapper;
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(QuarantineController.class);

    public QuarantineController(QuarantineService quarantineService, QuarantineMapper quarantineMapper, UserService userService) {
        this.quarantineService = quarantineService;
        this.userService = userService;
        this.quarantineMapper = quarantineMapper;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @GetMapping("/all")
    public ResponseEntity<?> getQuarantines() {
        try {
            return ResponseEntity.ok(quarantineMapper.toDTOs(quarantineService.findAllQuarantines()));
        } catch (Exception e) {
            logger.error("Error occurred while fetching quarantines", e);
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuarantine(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quarantineMapper.toDTO(quarantineService.findQuarantineById(id)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching quarantine", e);
            throw e;
        }
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
//    @GetMapping("/by-sector/{sectorId}")
//    public ResponseEntity<?> getQuarantinesBySector(@PathVariable Long sectorId) {
//        try {
//            return ResponseEntity.ok(quarantineMapper.toDTOs(quarantineService.findQuarantinesBySector(sectorId)));
//        } catch (Exception e) {
//            logger.error("Error occurred while fetching quarantines by pet", e);
//            throw e;
//        }
//    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @GetMapping("reasons-by-sector/{sectorId}")
    public ResponseEntity<?> getDistinctReasonsBySector(@PathVariable Long sectorId) {
        try {
            return ResponseEntity.ok(quarantineService.findDistinctReason(sectorId));
        } catch (Exception e) {
            logger.error("Error occurred while fetching distinct reasons by sector", e);
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @GetMapping("/by-pet/{petId}")
    public ResponseEntity<?> getQuarantinesByPet(@PathVariable Long petId) {
        try {
            return ResponseEntity.ok(quarantineMapper.toDTOs(quarantineService.findQuarantinesByPet(petId)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching quarantines by pet", e);
            throw e;
        } //TODO: в профиле вместо сектора писать уникальный идентификатор питомца
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @GetMapping("/sector/{sectorId}")
    public ResponseEntity<?> getQuarantinesBySector(
            @PathVariable Long sectorId,
            @RequestParam(required = false) QuarantineStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Quarantine> quarantines = quarantineService.findQuarantinesBySectorAndStatus(sectorId, status, page, size);
            List<QuarantineDTO> quarantineDTOs = quarantines.getContent()
                    .stream()
                    .map(quarantineMapper::toDTO)
                    .toList();
            return ResponseEntity.ok(quarantineDTOs);
        } catch (Exception e) {
            logger.error("Error occurred while fetching quarantines by sector and status", e);
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @PostMapping("/save")
    public ResponseEntity<?> saveQuarantine(@RequestBody QuarantineDTO quarantineDTO) throws BadRequestException {
        try {

            return ResponseEntity.ok(quarantineMapper.toDTO(quarantineService.save(quarantineDTO, userService.getAuthenticatedUser())));
        } catch (Exception e) {
            logger.error("Error occurred while saving quarantine", e);
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteQuarantine(@PathVariable Long id) {
        try {
            quarantineService.deleteQuarantineById(id);
            return ResponseEntity.ok("Quarantine" + id + "deleted successfully");
        } catch (Exception e) {
            logger.error("Error occurred while deleting quarantine", e);
            throw e;
        }
    }

}
