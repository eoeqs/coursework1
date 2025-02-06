package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.AvailableSlots;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailableSlotsRepository extends JpaRepository<AvailableSlots, Long> {
    List<AvailableSlots> findByIsAvailableTrue();
}
