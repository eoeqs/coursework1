package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.QuarantineStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "quarantine")
@Getter
@Setter

public class Quarantine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reason;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    private QuarantineStatus status;

    @ManyToOne
    @JoinColumn(name = "sector_id")
    private Sector sector; //нужно ли из секторов доставать каратины?

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    private AppUser vet;
}