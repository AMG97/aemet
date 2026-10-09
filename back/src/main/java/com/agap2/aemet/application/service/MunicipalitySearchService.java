package com.agap2.aemet.application.service;

import com.agap2.aemet.application.dto.MunicipalityResponse;
import com.agap2.aemet.application.mapper.MunicipalityMapper;
import com.agap2.aemet.domain.model.Municipality;
import com.agap2.aemet.domain.repository.MunicipalityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MunicipalitySearchService {

    private final MunicipalityRepository repository;
    private final MunicipalityMapper mapper;

    public MunicipalitySearchService(MunicipalityRepository repository, MunicipalityMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<MunicipalityResponse> searchByNamePrefix(String prefix) {
        List<Municipality> municipalities = repository.searchByNamePrefix(prefix);
        return mapper.toResponseList(municipalities);
    }
}