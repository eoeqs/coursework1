package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.repositories.PetsRepository;
import org.fergoeqs.coursework.repositories.UserRepository;
import org.fergoeqs.coursework.utils.PetMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Service
public class PetsService {
    private final PetsRepository petsRepository;
    private final UserRepository userRepository;
    private final PetMapper petMapper;

    public PetsService(PetsRepository petsRepository, UserRepository userRepository, PetMapper petMapper) {
        this.petsRepository = petsRepository;
        this.userRepository = userRepository;
        this.petMapper = petMapper;
    }

    public List<Pet> findAllPets() {
        return petsRepository.findAll();
    }

    public Pet findPetById(Long petId) {
        return petsRepository.findById(petId).orElseThrow();
    }

    @Transactional
    public void addPet(PetDTO petDTO, Long ownerId) {
        Pet pet = petMapper.petDTOToPet(petDTO);
        pet.setOwner(userRepository.findById(ownerId).orElseThrow());
        petsRepository.save(pet);
    }

    @Transactional
    public void updatePet(Long petId, Long authorId, PetDTO petDTO) {
        Pet pet = petsRepository.findById(petId).orElseThrow();
        AppUser author = userRepository.findById(authorId).orElseThrow();
        if (!pet.getOwner().getId().equals(authorId) && !isAdmin(author) && !isVet(author) ) {
            throw new IllegalArgumentException("User is not allowed to update this pet (only for owner, vet or admin)");
        }
        pet = petMapper.petDTOToPet(petDTO); //TODO: проверить
        petsRepository.save(pet);
    }

    @Transactional
    public void deletePet(Long petId, Long deleterId) {
        Pet pet = petsRepository.findById(petId).orElseThrow();
        AppUser deleter = userRepository.findById(deleterId).orElseThrow();
        if (!(isAdmin(deleter) && !isVet(deleter))) {
            throw new IllegalArgumentException("User is not allowed to delete pets");
        }
        petsRepository.delete(pet);
    }

    @Transactional
    public void bindPet(Long petId, Long vetId) {
        Pet pet = petsRepository.findById(petId).orElseThrow();
        AppUser vet = userRepository.findById(vetId).orElseThrow();
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
