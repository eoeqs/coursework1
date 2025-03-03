package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "report")
@Getter
@Setter

public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Report title is required for URL")
    private String contentUrl;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    private AppUser vet;

    @NotNull(message = "Anamnesis is required")
    @ManyToOne
    @JoinColumn(name = "anamnesis_id")
    private Anamnesis anamnesis;

}
