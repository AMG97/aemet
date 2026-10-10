package com.agap2.aemet.infrastructure.repository;

import com.agap2.aemet.domain.model.Municipality;
import com.agap2.aemet.domain.repository.MunicipalityRepository;
import com.agap2.aemet.infrastructure.client.AemetClient;
import com.agap2.aemet.infrastructure.dto.AemetMunicipality;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Repository
public class AemetMunicipalityRepositoryImpl implements MunicipalityRepository {

    private final AemetClient aemetClient;

    public AemetMunicipalityRepositoryImpl(AemetClient aemetClient) {
        this.aemetClient = aemetClient;
    }

    @Override
    public List<Municipality> findAll() {
        return aemetClient.getMunicipalitiesList().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Municipality> searchByNamePrefix(String prefix) {
        String lowerPrefix = prefix.toLowerCase(Locale.ROOT);
        return findAll().stream()
                .filter(m -> m.name().toLowerCase().startsWith(lowerPrefix))
                .toList();
    }

    private Municipality mapToDomain(AemetMunicipality aemetMunicipality) {
        String code = extractCode(aemetMunicipality.id());
        return new Municipality(code, aemetMunicipality.nombre());
    }

    private String extractCode(String id) {
        if (id == null) {
            return "";
        }
        return id.replace("id", "");
    }
}