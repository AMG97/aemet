package com.agap2.aemet.application.usecases;

import com.agap2.aemet.domain.model.Municipality;
import com.agap2.aemet.domain.repository.MunicipalityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchMunicipalitiesByPrefixUseCase {

    private final MunicipalityRepository repository;

    public SearchMunicipalitiesByPrefixUseCase(MunicipalityRepository repository) {
        this.repository = repository;
    }

    public List<Municipality> execute(String prefix) {
        return repository.searchByNamePrefix(prefix);
    }
}