package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.RatingAndReviewsDTO;
import org.fergoeqs.coursework.models.RatingAndReviews;
import org.fergoeqs.coursework.repositories.RatingAndReviewsRepository;
import org.fergoeqs.coursework.utils.Mappers.RatingAndReviewsMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingAndReviewsService {
    private final RatingAndReviewsRepository ratingAndReviewsRepository;
    private final UserService userService;
    private final RatingAndReviewsMapper rrMapper;

    public RatingAndReviewsService(RatingAndReviewsRepository ratingAndReviewsRepository, UserService userService, RatingAndReviewsMapper ratingAndReviewsMapper) {
        this.ratingAndReviewsRepository = ratingAndReviewsRepository;
        this.userService = userService;
        this.rrMapper = ratingAndReviewsMapper;
    }

    public RatingAndReviews findById(Long id) {
        return ratingAndReviewsRepository.findById(id).orElse(null);
    }

    public List<RatingAndReviews> findAllByVetId(Long vetId) {
        return ratingAndReviewsRepository.findAllByVetId(vetId);
    }

    public RatingAndReviews save(RatingAndReviewsDTO ratingAndReviewsDTO) {
        RatingAndReviews rr = rrMapper.fromDTO(ratingAndReviewsDTO);
        rr.setVet(userService.findById(ratingAndReviewsDTO.vet()).orElse(null));
        rr.setOwner(userService.findById(ratingAndReviewsDTO.owner()).orElse(null));
        return ratingAndReviewsRepository.save(rr);
    }

    public void deleteById(Long id) {
        ratingAndReviewsRepository.deleteById(id);
    }
}
