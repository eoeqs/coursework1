package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "recommended_diagnosis")
@Getter
@Setter

public class RecommendedDiagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Boolean contagious;

    @ManyToOne
    @JoinColumn(name = "body_part_id")
    private BodyPart bodyPart;

    @ManyToMany
    @JoinTable(
            name = "diagnosis_symptom",
            joinColumns = @JoinColumn(name = "recommended_diagnosis_id"),
            inverseJoinColumns = @JoinColumn(name = "symptom_id")
    )
    private List<Symptom> symptoms;
}