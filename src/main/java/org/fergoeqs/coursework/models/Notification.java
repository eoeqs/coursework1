package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter

public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateTime = LocalDateTime.now();
    private String content;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "app_user_id")
    private AppUser appUser;
}