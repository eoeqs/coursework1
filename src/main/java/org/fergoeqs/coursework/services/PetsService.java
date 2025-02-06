package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.repositories.PetsRepository;
import org.fergoeqs.coursework.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class PetsService {
    private final PetsRepository petsRepository;
    private final UserRepository userRepository;

    public PetsService(PetsRepository petsRepository, UserRepository userRepository) {
        this.petsRepository = petsRepository;
        this.userRepository = userRepository;
    }

    public Pet addPet(PetDTO petDTO, Long ownerId) {
        Pet pet = new Pet();
        pet.setName(petDTO.getName());
        pet.setBreed(petDTO.getBreed());
        pet.setType(petDTO.getType());
        pet.setWeight(petDTO.getWeight());
        pet.setSex(petDTO.getSex());
        pet.setAge(petDTO.getAge());
        pet.setOwner(userRepository.findById(ownerId).orElseThrow());
        return petsRepository.save(pet);
    }

    public void updatePet(Long petId, Long authorId, PetDTO petDTO) {
        Pet pet = petsRepository.findById(petId).orElseThrow();
        AppUser author = userRepository.findById(authorId).orElseThrow();
        if (!pet.getOwner().getId().equals(authorId) && !isAdmin(author) && !isVet(author) ) {
            throw new IllegalArgumentException("User is not allowed to update this pet (only for owner, vet or admin)");
        }
        pet.setName(petDTO.getName());
        pet.setBreed(petDTO.getBreed());
        pet.setType(petDTO.getType());
        pet.setWeight(petDTO.getWeight());
        pet.setSex(petDTO.getSex());
        pet.setAge(petDTO.getAge());
        petsRepository.save(pet);
    }

    public void deletePet(Long petId, Long deleterId) {
        Pet pet = petsRepository.findById(petId).orElseThrow();
        AppUser deleter = userRepository.findById(deleterId).orElseThrow();
        if (!(isAdmin(deleter) && !isVet(deleter))) {
            throw new IllegalArgumentException("User is not allowed to delete pets");
        }
        petsRepository.delete(pet);
    }

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
