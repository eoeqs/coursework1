package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlotsRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByIsAvailableTrueAndIsPriorityFalse();
    List<Slot> findByIsAvailableTrueAndIsPriorityTrue();
}
