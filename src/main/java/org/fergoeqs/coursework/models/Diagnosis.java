package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    private String name;
    private String description;
    private LocalDateTime date;
    private Boolean contagious;
    private String examinationPlan; //план обследования

    @NotNull
    @ManyToOne
    @JoinColumn(name = "anamnesis_id")
    private Anamnesis anamnesis;
}