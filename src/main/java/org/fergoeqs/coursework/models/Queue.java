package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "queue")
@Getter
@Setter

public class Queue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer position;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
}