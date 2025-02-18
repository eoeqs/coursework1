package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "anamnesis")
@Getter
@Setter

public class Anamnesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name; //например, Headache

    @Column(length = 1000)
    private String description;
    private LocalDate date;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @NotNull
    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private String anamnesisUrl;
}
