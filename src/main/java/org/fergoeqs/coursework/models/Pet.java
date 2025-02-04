package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Enumerated(EnumType.STRING)
    private PetType type;

    private BigDecimal weight;

    @Enumerated(EnumType.STRING)
    private SexEnum sex;

    private Integer age;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @ManyToOne
    @JoinColumn(name = "sector_id")
    private Sector sector;
}