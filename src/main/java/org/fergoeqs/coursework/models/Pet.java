package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.PetType;
import org.fergoeqs.coursework.models.enums.SexEnum;

import java.math.BigDecimal;

@Entity
@Table(name = "pet")
@Getter
@Setter

public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String breed;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PetType type;

    @Min(value = 0, message = "Weight can't be less than 0")
    @Max(value = 120, message = "Weight can't be more than 120")
    private BigDecimal weight;

    @Enumerated(EnumType.STRING)
    private SexEnum sex;

    @Min(value = 0, message = "Age can't be less than 0")
    @Max(value = 40, message = "Age can't be more than 40")
    private Integer age;

    @ManyToOne
    @JoinColumn(name = "actual_vet_id")
    private AppUser actualVet;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private AppUser owner;

    @ManyToOne
    @JoinColumn(name = "sector_id")
    private Sector sector;

    @Column(length = 500)
    private String photoUrl;
}