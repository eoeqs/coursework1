package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
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
    private String symptoms;
    private String notes;

    private boolean dynamics;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
}