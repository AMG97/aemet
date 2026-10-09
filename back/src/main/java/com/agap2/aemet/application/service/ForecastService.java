package com.agap2.aemet.application.service;

import com.agap2.aemet.application.dto.ForecastResponse;
import com.agap2.aemet.application.mapper.ForecastMapper;
import com.agap2.aemet.domain.model.TemperatureUnit;
import com.agap2.aemet.domain.repository.ForecastRepository;
import org.springframework.stereotype.Service;

@Service
public class ForecastService {

    private final ForecastRepository repository;
    private final ForecastMapper mapper;

    public ForecastService(ForecastRepository repository, ForecastMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    private static TemperatureUnit toDomainUnit(String unit) {
        if (unit == null) return TemperatureUnit.CELSIUS;
        return switch (unit.toUpperCase()) {
            case "G_FAH", "FAHRENHEIT" -> TemperatureUnit.FAHRENHEIT;
            case "G_CEL", "CELSIUS", "CELSIUS_ES" -> TemperatureUnit.CELSIUS;
            default -> TemperatureUnit.CELSIUS;
        };
    }

    private static String toApiUnit(String unit) {
        if (unit == null || unit.isBlank()) return "G_CEL";
        return switch (unit.toUpperCase()) {
            case "FAHRENHEIT", "FAH" -> "G_FAH";
            default -> "G_CEL";
        };
    }

    public ForecastResponse getNextDayForecast(String municipalityCode, String unit) {
        TemperatureUnit domainUnit = toDomainUnit(unit);
        var forecast = repository.getNextDayForecast(municipalityCode, domainUnit);
        String apiUnit = toApiUnit(forecast.temperatureUnit());
        return mapper.toResponse(forecast, apiUnit);
    }
}