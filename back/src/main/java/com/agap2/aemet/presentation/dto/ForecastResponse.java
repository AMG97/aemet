package com.agap2.aemet.presentation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ForecastResponse(
        @JsonProperty("mediaTemperatura") Double averageTemperature,
        @JsonProperty("unidadTemperatura") String temperatureUnit,
        @JsonProperty("probPrecipitacion") List<PrecipitationProbabilityResponse> precipitationProbabilities
) {
}