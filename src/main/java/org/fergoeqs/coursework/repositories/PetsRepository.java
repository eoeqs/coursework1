package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PetsRepository extends JpaRepository<Pet, Long> {
    Optional<Pet> findByName(String name);
    List<Pet> findAllByOwnerId(Long ownerId);
    List<Pet> findAllByActualVetId(Long actualVetId);
}
