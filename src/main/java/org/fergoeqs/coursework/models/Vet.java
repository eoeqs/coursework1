package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vet")
@Getter
@Setter
public class Vet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String qualification;
    private String workingHours;
    private String schedule;

    @ManyToOne
    @JoinColumn(name = "clinic_id", nullable = false)
    private Clinic clinic;

    @OneToOne
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;
}
