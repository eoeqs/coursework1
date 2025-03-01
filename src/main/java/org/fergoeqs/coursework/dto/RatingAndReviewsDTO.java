package org.fergoeqs.coursework.dto;


public record RatingAndReviewsDTO (
    Long id,
    Integer rating,
    String review,
    Long vet,
    Long owner
){}
