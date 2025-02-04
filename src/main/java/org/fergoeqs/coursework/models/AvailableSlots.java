package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "available_slots")
@Getter
@Setter

public class AvailableSlots {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable = true;

    @ManyToOne
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;
}
