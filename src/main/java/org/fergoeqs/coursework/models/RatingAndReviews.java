package org.fergoeqs.coursework.models;

import jakarta.persistence.*;
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
    private Integer rating;

    private String review;

    @ManyToOne
    @JoinColumn(name = "vet_id", nullable = false)
    private AppUser vet;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;
}
