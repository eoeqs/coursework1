package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
}