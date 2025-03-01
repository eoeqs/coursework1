package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.BodyPart;

import java.time.LocalDateTime;
import java.util.List;

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

    @Column(length = 1000)
    private String description;
    private LocalDateTime date;
    private Boolean contagious;
    @Column(length = 1000)
    private String examinationPlan;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "anamnesis_id")
    private Anamnesis anamnesis;

    @NotNull
    @Enumerated(EnumType.STRING)
    private BodyPart bodyPart;

    @OneToMany
    @JoinColumn(name = "symptom_id")
    private List<Symptom> symptoms;
}