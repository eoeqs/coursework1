package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.BodyPart;

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

    @Enumerated(EnumType.STRING)
    private BodyPart bodyPart;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
}