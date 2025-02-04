package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "anamnesis")
@Getter
@Setter

public class Anamnesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
}
