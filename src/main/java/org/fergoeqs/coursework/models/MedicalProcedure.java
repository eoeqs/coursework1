package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.ProcedureType;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_procedure")
@Getter
@Setter

public class MedicalProcedure { //для таймлайна процедур
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ProcedureType type;
    private String name;
    private LocalDateTime date;
    private String description;
    private String notes; // доп. примечания

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    private AppUser vet;

    private String reportUrl;
}