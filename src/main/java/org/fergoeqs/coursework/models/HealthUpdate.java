package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_update")
@Getter
@Setter

public class HealthUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    @Column(length = 1000)
    private String symptoms;

    @Column(length = 1000)
    private String notes;

    @NotNull(message = "The dynamics of the health update is required")
    private boolean dynamics;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
}