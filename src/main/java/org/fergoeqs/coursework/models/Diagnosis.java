package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis")
@Getter
@Setter

public class Diagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDateTime date;
    private Boolean contagious;

    @ManyToOne
    @JoinColumn(name = "anamnesis_id")
    private Anamnesis anamnesis;
}