package com.agap2.aemet.presentation.controller;

import com.agap2.aemet.application.dto.ForecastResponse;
import com.agap2.aemet.application.service.ForecastService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/forecast")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @GetMapping("/next-day")
    public ResponseEntity<ForecastResponse> getNextDayForecast(
            @RequestParam String municipalityCode,
            @RequestParam(required = false, defaultValue = "G_CEL") String unit) {
        ForecastResponse forecast = forecastService.getNextDayForecast(municipalityCode, unit);
        return ResponseEntity.ok(forecast);
    }
}