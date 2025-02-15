package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.RatingAndReviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingAndReviewsRepository extends JpaRepository<RatingAndReviews, Long> {
    List<RatingAndReviews> findAllByVetId(Long vetId);
}
