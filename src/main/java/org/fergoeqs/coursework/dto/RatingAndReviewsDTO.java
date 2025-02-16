package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.AppUser;

public record RatingAndReviewsDTO (
    Long id,
    Integer rating,
    String review,
    Long vet,
    Long owner
){}
