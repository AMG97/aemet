package com.agap2.aemet.presentation.mapper;

import com.agap2.aemet.presentation.dto.MunicipalityResponse;
import com.agap2.aemet.domain.model.Municipality;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MunicipalityMapper {

    public MunicipalityResponse toResponse(Municipality municipality) {
        return new MunicipalityResponse(municipality.code(), municipality.name());
    }

    public List<MunicipalityResponse> toResponseList(List<Municipality> municipalities) {
        return municipalities.stream()
                .map(this::toResponse)
                .toList();
    }
}