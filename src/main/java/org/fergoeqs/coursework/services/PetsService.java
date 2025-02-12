package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.repositories.PetsRepository;
import org.fergoeqs.coursework.utils.PetMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Service
public class PetsService {
    private final PetsRepository petsRepository;
    private final PetMapper petMapper;
    private final SectorsService sectorsService;

    public PetsService(PetsRepository petsRepository, PetMapper petMapper, SectorsService sectorsService) {
        this.petsRepository = petsRepository;
        this.petMapper = petMapper;
        this.sectorsService = sectorsService;
    }

    public List<Pet> findAllPets() {
        return petsRepository.findAll();
    }

    public Pet findPetById(Long petId) {
        return petsRepository.findById(petId).orElseThrow();
    }

    public List<Pet> findPetsByOwner(Long ownerId) {
        return petsRepository.findAllByOwnerId(ownerId);
    }

    @Transactional
    public void addPet(PetDTO petDTO, AppUser owner) {
        Pet pet = petMapper.petDTOToPet(petDTO);
        pet.setOwner(owner);
        petsRepository.save(pet);
    }

    @Transactional
    public void updatePet(Long petId, AppUser author, PetDTO petDTO) {
        Pet pet = petsRepository.findById(petId).orElseThrow();
        if (!pet.getOwner().equals(author) && !isAdmin(author) && !isVet(author) ) {
            throw new IllegalArgumentException("User is not allowed to update this pet (only for owner, vet or admin)");
        }
        petsRepository.save(petMapper.petDTOToPet(petDTO)); //TODO: проверить, работает ли маппер при обновлении
    }

    @Transactional
    public void deletePet(Long petId, AppUser deleter) {
        Pet pet = petsRepository.findById(petId).orElseThrow();
        if (!(isAdmin(deleter) && !isVet(deleter))) {
            throw new IllegalArgumentException("User is not allowed to delete pets");
        }
        petsRepository.delete(pet);
    }

    @Transactional
    public void placeInSector(Long petId, Long sectorId) { //TODO: триггер на занятие слота в секторе
        Pet pet = petsRepository.findById(petId).orElseThrow();
        pet.setSector(sectorsService.findSectorById(sectorId));
        petsRepository.save(pet);
    }

    @Transactional
    public void removeFromSector(Long petId) { //TODO: триггер на освобождение слота в секторе
        Pet pet = petsRepository.findById(petId).orElseThrow();
        pet.setSector(null);
        petsRepository.save(pet);
    }


    @Transactional
    public void bindPet(Long petId, AppUser vet) {
        Pet pet = petsRepository.findById(petId).orElseThrow();
        if (!isVet(vet)) {
            throw new IllegalArgumentException("User is not allowed to bind pets");
        }
        pet.setActualVet(vet);
        petsRepository.save(pet);
    }

    private boolean isVet(AppUser user) {
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("VET"));
    }

    private boolean isAdmin(AppUser user) {
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
    }

}
