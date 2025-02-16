package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.RatingAndReviewsDTO;
import org.fergoeqs.coursework.models.RatingAndReviews;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RatingAndReviewsMapper {
    @Mapping(source = "vet", target = "vet.id")
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "id", ignore = true)
    RatingAndReviews fromDTO(RatingAndReviewsDTO ratingAndReviewsDTO);
    @Mapping(source = "vet", target = "vet.id")
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "id", ignore = true)
    List<RatingAndReviews> fromDTOs(List<RatingAndReviewsDTO> ratingAndReviewsListDTO);

    @Mapping(source = "vet.id", target = "vet")
    @Mapping(source = "owner.id", target = "owner")
    RatingAndReviewsDTO toDTO(RatingAndReviews ratingAndReviews);
    @Mapping(source = "vet.id", target = "vet")
    @Mapping(source = "owner.id", target = "owner")
    List<RatingAndReviewsDTO> toDTOs(List<RatingAndReviews> ratingAndReviewsList);
}
