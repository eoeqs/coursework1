package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "treatment")
@Getter
@Setter

public class Treatment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String prescribedMedication;
    private String duration;

    @ManyToOne
    @JoinColumn(name = "diagnosis_id")
    private Diagnosis diagnosis;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    private Boolean isCompleted;

    //    @ManyToOne
    //    @JoinColumn(name = "medical_procedure_id")
    //    private MedicalProcedure medicalProcedure; //зачем оно тут было?
}
