package com.agap2.aemet.domain.repository;

import com.agap2.aemet.domain.model.Municipality;
import java.util.List;

public interface MunicipalityRepository {
    List<Municipality> findAll();
    List<Municipality> searchByNamePrefix(String prefix);
}