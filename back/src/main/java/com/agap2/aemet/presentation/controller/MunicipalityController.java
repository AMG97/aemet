package com.agap2.aemet.presentation.controller;

import com.agap2.aemet.application.dto.MunicipalityResponse;
import com.agap2.aemet.application.service.MunicipalitySearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/municipalities")
public class MunicipalityController {

    private final MunicipalitySearchService municipalitySearchService;

    public MunicipalityController(MunicipalitySearchService municipalitySearchService) {
        this.municipalitySearchService = municipalitySearchService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<MunicipalityResponse>> searchByNamePrefix(
            @RequestParam(required = false, defaultValue = "") String prefix) {
        List<MunicipalityResponse> municipalities = municipalitySearchService.searchByNamePrefix(prefix);
        return ResponseEntity.ok(municipalities);
    }
}