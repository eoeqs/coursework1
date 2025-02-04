package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "body_marker")
@Getter
@Setter

public class BodyMarker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer positionX;
    private Integer positionY;

    @ManyToOne
    @JoinColumn(name = "body_part_id")
    private BodyPart bodyPart;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
}