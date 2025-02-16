package org.fergoeqs.coursework.controllers;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.RatingAndReviewsDTO;
import org.fergoeqs.coursework.services.RatingAndReviewsService;
import org.fergoeqs.coursework.utils.Mappers.RatingAndReviewsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rating-and-reviews")
public class RatingAndReviewsController {
    private final RatingAndReviewsService ratingAndReviewsService;
    private final RatingAndReviewsMapper ratingAndReviewsMapper;
    private static final Logger logger = LoggerFactory.getLogger(RatingAndReviewsController.class);

    public RatingAndReviewsController(RatingAndReviewsService ratingAndReviewsService, RatingAndReviewsMapper ratingAndReviewsMapper) {
        this.ratingAndReviewsService = ratingAndReviewsService;
        this.ratingAndReviewsMapper = ratingAndReviewsMapper;
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getRatingAndReviews(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ratingAndReviewsMapper.toDTO(ratingAndReviewsService.findById(id)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching rating and reviews", e);
            throw e;
        }
    }

    @GetMapping("/by-vet/{vetId}")
    public ResponseEntity<?> getRatingAndReviewsByVet(@PathVariable Long vetId) {
        try {
            return ResponseEntity.ok(ratingAndReviewsMapper.toDTOs(ratingAndReviewsService.findAllByVetId(vetId)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching rating and reviews by vet", e);
            throw e;
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveRatingAndReviews(@RequestBody RatingAndReviewsDTO ratingAndReviewsDTO) throws BadRequestException {
        try {
            return ResponseEntity.ok(ratingAndReviewsMapper.toDTO(ratingAndReviewsService.save(ratingAndReviewsDTO)));
        } catch (Exception e) {
            logger.error("Error occurred while saving rating and reviews", e);
            throw e;
        }
    }
}
