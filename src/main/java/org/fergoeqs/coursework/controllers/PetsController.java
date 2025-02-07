package org.fergoeqs.coursework.controllers;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.services.PetsService;
import org.fergoeqs.coursework.services.UserService;
import org.fergoeqs.coursework.utils.PetMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetsController {
    private final PetMapper petMapper;
    private final PetsService petsService;
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(PetsController.class);

    public PetsController (PetMapper petMapper, PetsService petsService, UserService userService) {
        this.petMapper = petMapper;
        this.petsService = petsService;
        this.userService = userService;
    }

    @GetMapping("/get-all-pets")
    public ResponseEntity<?> getAllPets() throws BadRequestException {
        try {
            List<Pet> pets = petsService.findAllPets();
            return ResponseEntity.ok(petMapper.petsToPetDTOs(pets));

        } catch (Exception e) {
            logger.error("Pets fetching failed: {}", e.getMessage());
            throw new BadRequestException("Pets fetching failed");
        }
    }

    @GetMapping("/get-pet/{petId}")
    public ResponseEntity<?> getPet(@PathVariable Long petId) throws BadRequestException {
        try {
            return ResponseEntity.ok(petMapper.petToPetDTO(petsService.findPetById(petId)));
        } catch (Exception e) {
            logger.error("Pet fetching failed: {}", e.getMessage());
            throw new BadRequestException("Pet fetching failed");
        }
    }

    @PostMapping("/new-pet")
    public ResponseEntity<?> createPet(@RequestBody PetDTO petDTO) throws BadRequestException {
        try {
            petsService.addPet(petDTO, userService.getAuthenticatedUser().getId());
            return ResponseEntity.ok(petDTO);
        } catch (Exception e) {
            logger.error("Pet creation failed: {}", e.getMessage());
            throw new BadRequestException("Pet creation failed"); //TODO: переписать эксепшены
        }
    }

    @PostMapping("/update-pet")
    public ResponseEntity<?> updatePet(@RequestBody PetDTO petDTO,
                                       @PathVariable Long petId) throws BadRequestException {
        try {
            petsService.updatePet(petId, userService.getAuthenticatedUser().getId(), petDTO);
            return ResponseEntity.ok(petDTO);
        } catch (Exception e) {
            logger.error("Pet updating failed: {}", e.getMessage());
            throw new BadRequestException("Pet updating failed"); //TODO: переписать эксепшены
        }
    }

    @DeleteMapping("/delete-pet/{petId}")
    public ResponseEntity<?> deletePet(@PathVariable Long petId) throws BadRequestException {
        try {
            petsService.deletePet(petId, userService.getAuthenticatedUser().getId());
            return ResponseEntity.ok("Pet" + petId + " deleted");
        } catch (Exception e) {
            logger.error("Pet deleting failed: {}", e.getMessage());
            throw new BadRequestException("Pet deleting failed");
        }
    }


}
