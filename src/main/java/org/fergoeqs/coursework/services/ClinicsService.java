package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.ClinicDTO;
import org.fergoeqs.coursework.models.Clinic;
import org.fergoeqs.coursework.repositories.ClinicsRepository;
import org.fergoeqs.coursework.utils.Mappers.ClinicMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClinicsService {
    private final ClinicsRepository clinicsRepository;
    private final ClinicMapper clinicMapper;

    public ClinicsService(ClinicsRepository clinicsRepository, ClinicMapper clinicMapper) {
        this.clinicsRepository = clinicsRepository;
        this.clinicMapper = clinicMapper;
    }
    public Clinic findById(Long clinicId) {
        return clinicsRepository.findById(clinicId).orElse(null);
    }

    public List<Clinic> findAll() {
        return clinicsRepository.findAll();
    }

    public Clinic save(ClinicDTO clinicDTO) {
        return clinicsRepository.save(clinicMapper.clinicDTOToClinic(clinicDTO));
    }

    public void delete(Long clinicId) {
        clinicsRepository.deleteById(clinicId);
    }

    public void update(ClinicDTO clinicDTO) {
        clinicsRepository.save(clinicMapper.clinicDTOToClinic(clinicDTO));
    }

}
