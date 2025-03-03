package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.CategoryType;

@Entity
@Table(name = "sector")
@Getter
@Setter

public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private CategoryType category;

    @Min(value = 1, message = "Capacity must be greater than 0")
    @Max(value = 200, message = "Capacity must be less than 200")
    private Integer capacity;

    @Min(value = 0, message = "Occupancy must be greater than 0")
    private Integer occupancy;

    private Boolean isAvailable;
}