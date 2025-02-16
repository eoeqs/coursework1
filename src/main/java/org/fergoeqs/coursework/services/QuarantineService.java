package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.QuarantineDTO;
import org.fergoeqs.coursework.models.Quarantine;
import org.fergoeqs.coursework.models.enums.QuarantineStatus;
import org.fergoeqs.coursework.repositories.QuarantineRepository;
import org.fergoeqs.coursework.utils.Mappers.QuarantineMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuarantineService {
    private final QuarantineRepository quarantineRepository;
    private final SectorsService sectorsService;
    private final PetsService petsService;
    private final QuarantineMapper quarantineMapper;

    public QuarantineService(QuarantineRepository quarantineRepository, SectorsService sectorsService, PetsService petsService, QuarantineMapper quarantineMapper) {
        this.quarantineRepository = quarantineRepository;
        this.sectorsService = sectorsService;
        this.petsService = petsService;
        this.quarantineMapper = quarantineMapper;
    }

    public Quarantine findQuarantineById(Long id) {
        return quarantineRepository.findById(id).orElse(null);
    }

    public List<Quarantine> findQuarantinesBySector(Long sectorId) {
        return quarantineRepository.findQuarantinesBySectorId(sectorId);
    }

    public List<Quarantine> findAllQuarantines() {
        return quarantineRepository.findAll();
    }

    public Quarantine save(QuarantineDTO quarantineDTO) { //TODO: валидировать startDate < endDate
        Quarantine quarantine = quarantineMapper.fromDTO(quarantineDTO);
        quarantine.setStatus(QuarantineStatus.CURRENT);
        return quarantineRepository.save(setRelativeFields(quarantine, quarantineDTO));
    }

    public void deleteQuarantineById(Long id) {
        quarantineRepository.deleteById(id);
    }

    @Scheduled(cron = "0 0 * * * *")
    public void updateExpiredQuarantines() {
        LocalDateTime now = LocalDateTime.now();

        List<Quarantine> quarantines = quarantineRepository.findByEndDateBeforeAndStatusNot(now, QuarantineStatus.DONE);

        for (Quarantine quarantine : quarantines) {
            quarantine.setStatus(QuarantineStatus.DONE);
            quarantineRepository.save(quarantine);
        }
    }

    private Quarantine setRelativeFields(Quarantine quarantine, QuarantineDTO quarantineDTO) {
        quarantine.setSector(sectorsService.findSectorById(quarantineDTO.sector()));
        quarantine.setPet(petsService.findPetById(quarantineDTO.pet()));
        return quarantine;
    }
}
