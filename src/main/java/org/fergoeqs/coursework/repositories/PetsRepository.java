package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PetsRepository extends JpaRepository<Pet, Long> {
    Optional<Pet> findByName(String name);
}
