package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.BodyPart;

import java.util.List;

@Entity
@Table(name = "recommended_diagnosis")
@Getter
@Setter

public class RecommendedDiagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;
    private String description;
    private Boolean contagious;

    @NotNull
    @Enumerated(EnumType.STRING)
    private BodyPart bodyPart;

    @ManyToMany
    @JoinTable(
            name = "diagnosis_symptom", //rec_diagnosis_symptom
            joinColumns = @JoinColumn(name = "recommended_diagnosis_id"),
            inverseJoinColumns = @JoinColumn(name = "symptom_id")
    )
    private List<Symptom> symptoms;
}