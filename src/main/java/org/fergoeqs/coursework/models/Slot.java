package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "available_slots")
@Getter
@Setter

public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    private Boolean isAvailable = true;

    private Boolean isPriority;

    @NotNull(message = "Vet is required")
    @ManyToOne
    @JoinColumn(name = "vet_id", nullable = false)
    private AppUser vet;
}
