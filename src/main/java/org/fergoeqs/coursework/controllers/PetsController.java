package org.fergoeqs.coursework.controllers;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.services.PetsService;
import org.fergoeqs.coursework.services.UserService;
import org.fergoeqs.coursework.utils.Mappers.AppUserMapper;
import org.fergoeqs.coursework.utils.Mappers.PetMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetsController {
    private final PetMapper petMapper;
    private final PetsService petsService;
    private final UserService userService;
    private final AppUserMapper appUserMapper;
    private static final Logger logger = LoggerFactory.getLogger(PetsController.class);

    public PetsController (PetMapper petMapper, PetsService petsService, UserService userService,
                           AppUserMapper appUserMapper) {
        this.petMapper = petMapper;
        this.petsService = petsService;
        this.userService = userService;
        this.appUserMapper = appUserMapper;
    }

    @GetMapping("/all-pets")
    public ResponseEntity<?> getAllPets(){
        try {
            List<Pet> pets = petsService.findAllPets();
            return ResponseEntity.ok(petMapper.petsToPetDTOs(pets));

        } catch (Exception e) {
            logger.error("Pets fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<?> getPet(@PathVariable Long petId) {
        try {
            return ResponseEntity.ok(petMapper.petToPetDTO(petsService.findPetById(petId)));
        } catch (Exception e) {
            logger.error("Pet fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/user-pets")
    public ResponseEntity<?> getUserPets() throws BadRequestException {
        try {
            return ResponseEntity.ok(petMapper.petsToPetDTOs(
                    petsService.findPetsByOwner(userService.getAuthenticatedUser().getId())));
        } catch (Exception e) {
            logger.error("User pets fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/doctor-pets/{vetId}")
    public ResponseEntity<?> getDoctorPets(@PathVariable Long vetId) {
        try {
            return ResponseEntity.ok(petMapper.petsToPetDTOs(
                    petsService.findPetsByVet(vetId)));
        } catch (Exception e) {
            logger.error("Doctor pets fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/owner/{petId}")
    public ResponseEntity<?> getOwner(@PathVariable Long petId) {
        try {
            return ResponseEntity.ok(appUserMapper.toDTO(petsService.findPetById(petId).getOwner()));
        } catch (Exception e) {
            logger.error("Owner fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/new-pet")
    public ResponseEntity<?> createPet(@RequestBody PetDTO petDTO) throws BadRequestException {
        try {
            return ResponseEntity.ok(petMapper.petToPetDTO(petsService.addPet(petDTO, userService.getAuthenticatedUser())));
        } catch (Exception e) {
            logger.error("Pet creation failed: {}", e.getMessage());
            throw e; //TODO: переписать catch, когда будут валидаторы.
        }
    }

    @PutMapping("/update-pet/{petId}")
    public ResponseEntity<?> updatePet(@RequestBody PetDTO petDTO,
                                       @PathVariable Long petId) throws BadRequestException {
        try {
            petsService.updatePet(petId, userService.getAuthenticatedUser(), petDTO);
            return ResponseEntity.ok(petMapper.petToPetDTO(petsService.updatePet(petId, userService.getAuthenticatedUser(), petDTO)));
        } catch (Exception e) {
            logger.error("Pet updating failed: {}", e.getMessage());
            throw e; //TODO: проверять, что редактировать может только владелец или врач
        }
    }

    @PreAuthorize("hasRole('ROLE_VET')")
    @PutMapping("/bind/{petId}")
    public ResponseEntity<?> bindPet(@PathVariable Long petId) throws BadRequestException {
        try {
            petsService.bindPet(petId, userService.getAuthenticatedUser()); //TODO: только врач может или админ тоже?
            return ResponseEntity.ok("Pet " + petId + " bound");
        } catch (Exception e) {
            logger.error("Pet binding failed: {}", e.getMessage());
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @PutMapping("/sector-place/{petId}") //TODO: requestParam удобно?????
    public ResponseEntity<?> setSectorPlace(@PathVariable Long petId, @RequestParam Long sectorId) {
        try {
            petsService.placeInSector(petId, sectorId);
            return ResponseEntity.ok("Pet" + petId + " set to sector " + sectorId);
        } catch (Exception e) {
            logger.error("Pet sector setting failed: {}", e.getMessage());
            throw e;
        } //TODO: нужен ли эндпоинт на вызволение из сектора?
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @PutMapping("/unbind/{petId}")
    public ResponseEntity<?> unbindPet(@PathVariable Long petId) throws BadRequestException {
        try {
            petsService.unbindPet(petId);
            return ResponseEntity.ok("Pet" + petId + " unbound");
        } catch (Exception e) {
            logger.error("Pet unbinding failed: {}", e.getMessage());
            throw e;
        }
    }

    @PutMapping("/update-avatar/{petId}")
    public ResponseEntity<?> updatePetAvatar(@PathVariable Long petId, @RequestParam("avatar") MultipartFile avatar) throws IOException {
        try {
            petsService.updatePetAvatar(petId, avatar);
            return ResponseEntity.ok("Pet " + petId + " avatar updated");
        } catch (Exception e) {
            logger.error("Pet avatar updating failed: {}", e.getMessage());
            throw e; //TODO: проверять, что может делать только врач или овнер
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @DeleteMapping("/delete-pet/{petId}")
    public ResponseEntity<?> deletePet(@PathVariable Long petId) throws BadRequestException {
        try {
            petsService.deletePet(petId, userService.getAuthenticatedUser());
            return ResponseEntity.ok("Pet" + petId + " deleted");
        } catch (Exception e) {
            logger.error("Pet deleting failed: {}", e.getMessage());
            throw e;
        }
    }



}
