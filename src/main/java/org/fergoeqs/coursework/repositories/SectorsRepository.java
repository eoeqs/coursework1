package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.Sector;
import org.fergoeqs.coursework.models.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectorsRepository extends JpaRepository<Sector, Long> {

    List<Sector> findAllByCategory(CategoryType category);

    List<Sector> findAllByIsAvailable(Boolean isAvailable);

    List<Sector> findAllByIsAvailableAndCategory(Boolean isAvailable, CategoryType category);
}
