package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_procedure")
@Getter
@Setter

public class MedicalProcedure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    private Vet vet;
}