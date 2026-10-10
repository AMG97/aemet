package com.agap2.aemet.presentation.mapper;

import com.agap2.aemet.presentation.dto.ForecastResponse;
import com.agap2.aemet.presentation.dto.PrecipitationProbabilityResponse;
import com.agap2.aemet.domain.model.Forecast;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class ForecastMapper {
    public ForecastResponse toResponse(Forecast forecast, String unit) {
        List<PrecipitationProbabilityResponse> probabilities = forecast.precipitationProbabilities().stream()
                .map(p -> new PrecipitationProbabilityResponse(p.probability(), p.period()))
                .toList();
        String unitLabel = unit != null ? unit : "G_CEL";
        return new ForecastResponse(
                forecast.averageTemperature(),
                unitLabel,
                probabilities
        );
    }
}