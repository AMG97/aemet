package com.agap2.aemet.domain.model;

import java.util.List;

public record Forecast(
        Double averageTemperature,
        String temperatureUnit,
        List<PrecipitationProbability> precipitationProbabilities
) {
}