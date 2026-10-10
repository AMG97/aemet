package com.agap2.aemet.presentation.controller;

import com.agap2.aemet.presentation.dto.MunicipalityResponse;
import com.agap2.aemet.application.usecases.SearchMunicipalitiesByPrefixUseCase;
import com.agap2.aemet.presentation.mapper.MunicipalityMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/municipalities")
public class MunicipalityController {

    private final SearchMunicipalitiesByPrefixUseCase searchMunicipalitiesByPrefixUseCase;
    private final MunicipalityMapper municipalityMapper;

    public MunicipalityController(
            SearchMunicipalitiesByPrefixUseCase searchMunicipalitiesByPrefixUseCase,
            MunicipalityMapper municipalityMapper
            ) {
        this.searchMunicipalitiesByPrefixUseCase = searchMunicipalitiesByPrefixUseCase;
        this.municipalityMapper = municipalityMapper;
    }

    @GetMapping("/search")
    public ResponseEntity<List<MunicipalityResponse>> searchByNamePrefix(
            @RequestParam String prefix) {

        return ResponseEntity.ok(
                municipalityMapper.toResponseList(
                        searchMunicipalitiesByPrefixUseCase.execute(prefix)
                )
        );
    }
}