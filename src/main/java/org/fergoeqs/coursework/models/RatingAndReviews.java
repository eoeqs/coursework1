package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "rating_and_reviews")
@Getter
@Setter

public class RatingAndReviews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Min(1)
    @Max(5)
    private Integer rating;

    private String review;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "vet_id", nullable = false)
    private AppUser vet;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;
}
