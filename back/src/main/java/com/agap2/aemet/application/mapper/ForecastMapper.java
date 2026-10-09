package com.agap2.aemet.application.mapper;

import com.agap2.aemet.application.dto.ForecastResponse;
import com.agap2.aemet.application.dto.PrecipitationProbabilityResponse;
import com.agap2.aemet.domain.model.Forecast;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class ForecastMapper {
    public ForecastResponse toResponse(Forecast forecast, String apiTemperatureUnit) {
        List<PrecipitationProbabilityResponse> probabilities = forecast.precipitationProbabilities().stream()
                .map(p -> new PrecipitationProbabilityResponse(p.probability(), p.period()))
                .toList();
        String unitLabel = apiTemperatureUnit != null ? apiTemperatureUnit : "G_CEL";
        return new ForecastResponse(
                forecast.averageTemperature(),
                unitLabel,
                probabilities
        );
    }
}