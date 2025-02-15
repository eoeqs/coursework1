package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.AnamnesisDTO;
import org.fergoeqs.coursework.models.Anamnesis;
import org.fergoeqs.coursework.repositories.AnamnesisRepository;
import org.fergoeqs.coursework.utils.Mappers.AnamnesisMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AnamnesisService {
    private final AnamnesisRepository anamnesisRepository;
    private final PetsService petsService;
    private final AnamnesisMapper anamnesisMapper;

    public AnamnesisService(AnamnesisRepository anamnesisRepository, AnamnesisMapper anamnesisMapper, PetsService petsService) {
        this.anamnesisRepository = anamnesisRepository;
        this.petsService = petsService;
        this.anamnesisMapper = anamnesisMapper;
    }

    public Anamnesis findAnamnesisById(Long id) {
        return anamnesisRepository.findById(id).orElse(null);
    }

    public List<Anamnesis> findAllAnamnesesByPet(Long petId) {
        return anamnesisRepository.findByPetId(petId);
    }

    public Anamnesis saveAnamnesis(AnamnesisDTO anamnesisDTO) {
        Anamnesis anamnesis = anamnesisMapper.fromDTO(anamnesisDTO);
        anamnesis.setPet(petsService.findPetById(anamnesisDTO.pet()));
        anamnesis.setDate(LocalDate.now());
        return anamnesisRepository.save(anamnesis);
    }

    public void deleteAnamnesis(Long id) {
        anamnesisRepository.deleteById(id);
    }
}
