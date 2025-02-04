package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.QuarantineStatus;

import java.time.LocalDate;

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
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private QuarantineStatus status;

    @ManyToOne
    @JoinColumn(name = "sector_id")
    private Sector sector;
}