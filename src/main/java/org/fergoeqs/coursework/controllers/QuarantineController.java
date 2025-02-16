package org.fergoeqs.coursework.controllers;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.QuarantineDTO;
import org.fergoeqs.coursework.services.QuarantineService;
import org.fergoeqs.coursework.services.UserService;
import org.fergoeqs.coursework.utils.Mappers.QuarantineMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/all")
    public ResponseEntity<?> getQuarantines() {
        try {
            return ResponseEntity.ok(quarantineMapper.toDTOs(quarantineService.findAllQuarantines()));
        } catch (Exception e) {
            logger.error("Error occurred while fetching quarantines", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuarantine(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quarantineMapper.toDTO(quarantineService.findQuarantineById(id)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching quarantine", e);
            throw e;
        }
    }

    @GetMapping("/by-sector/{sectorId}")
    public ResponseEntity<?> getQuarantinesBySector(@PathVariable Long sectorId) {
        try {
            return ResponseEntity.ok(quarantineMapper.toDTOs(quarantineService.findQuarantinesBySector(sectorId)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching quarantines by pet", e);
            throw e;
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveQuarantine(@RequestBody QuarantineDTO quarantineDTO) throws BadRequestException {
        try {

            return ResponseEntity.ok(quarantineMapper.toDTO(quarantineService.save(quarantineDTO, userService.getAuthenticatedUser())));
        } catch (Exception e) {
            logger.error("Error occurred while saving quarantine", e);
            throw e;
        }
    }

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

//  TODO:  @GetMapping("/find-by-pet/{petId}") //активный карантин по питомцу? все активные?