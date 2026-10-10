package com.agap2.aemet.presentation.controller;

import com.agap2.aemet.presentation.dto.ForecastResponse;
import com.agap2.aemet.presentation.dto.TemperatureUnitParam;
import com.agap2.aemet.application.usecases.GetNextDayForecastUseCase;
import com.agap2.aemet.presentation.mapper.ForecastMapper;
import com.agap2.aemet.domain.model.Forecast;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/forecast")
public class ForecastController {

    private final GetNextDayForecastUseCase getNextDayForecastUseCase;
    private final ForecastMapper forecastMapper;

    public ForecastController(
            GetNextDayForecastUseCase getNextDayForecastUseCase,
            ForecastMapper forecastMapper) {
        this.getNextDayForecastUseCase = getNextDayForecastUseCase;
        this.forecastMapper = forecastMapper;
    }

    @GetMapping("/next-day")
    public ResponseEntity<ForecastResponse> getNextDayForecast(
            @RequestParam String municipalityCode,
            @RequestParam(required = false, defaultValue = "G_CEL") TemperatureUnitParam unit) {
        Forecast forecast = getNextDayForecastUseCase.execute(municipalityCode, unit.toDomain());
        return ResponseEntity.ok(forecastMapper.toResponse(forecast, unit.toApiValue()));
    }
}