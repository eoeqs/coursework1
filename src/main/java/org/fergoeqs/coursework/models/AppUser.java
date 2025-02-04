package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.RoleType;

@Entity
@Table(name = "App_User")
@Getter
@Setter
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number", unique = true, nullable = false, length = 15)
    private String phoneNumber;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String surname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType role;

    //?????? ?????
    @ManyToOne
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;

    private String schedule;

    private String qualification;

    private String workingHours;

}
