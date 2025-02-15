package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.BodyMarkerDTO;
import org.fergoeqs.coursework.models.BodyMarker;
import org.fergoeqs.coursework.repositories.BodyMarkersRepository;
import org.fergoeqs.coursework.utils.Mappers.BodyMarkerMapper;
import org.springframework.stereotype.Service;

@Service
public class BodyMarkersService {
    private final BodyMarkersRepository bodyMarkersRepository;
    private final PetsService petsService;
    private final AppointmentsService appointmentsService;
    private final BodyMarkerMapper bodyMarkerMapper;

    public BodyMarkersService(BodyMarkersRepository bodyMarkersRepository, PetsService petsService,
                              AppointmentsService appointmentsService, BodyMarkerMapper bodyMarkerMapper) {
        this.bodyMarkersRepository = bodyMarkersRepository;
        this.petsService = petsService;
        this.appointmentsService = appointmentsService;
        this.bodyMarkerMapper = bodyMarkerMapper;
    }

    public BodyMarker findById(Long id) {
        return bodyMarkersRepository.findById(id).orElse(null);
    }

    public BodyMarker save(BodyMarkerDTO bodyMarkerDTO) {
        BodyMarker bodyMarker = bodyMarkerMapper.fromDTO(bodyMarkerDTO);
        return bodyMarkersRepository.save(setRelativeFields(bodyMarker, bodyMarkerDTO));
    }

    public BodyMarker update(Long id, BodyMarkerDTO bodyMarkerDTO) {
        BodyMarker bodyMarker = bodyMarkersRepository.findById(id).orElse(null);
        assert bodyMarker != null : "bodyMarker can't be null";
        bodyMarkerMapper.updateBodyMarkerFromDTO(bodyMarkerDTO, bodyMarker);
        return bodyMarkersRepository.save(setRelativeFields(bodyMarker, bodyMarkerDTO));
    }

    private BodyMarker setRelativeFields(BodyMarker bodyMarker, BodyMarkerDTO bodyMarkerDTO) {
        bodyMarker.setPet(petsService.findPetById(bodyMarkerDTO.pet()));
        bodyMarker.setAppointment(appointmentsService.findById(bodyMarkerDTO.appointment()));
        return bodyMarker;
    }
}
