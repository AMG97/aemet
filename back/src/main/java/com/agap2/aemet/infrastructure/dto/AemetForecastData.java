package com.agap2.aemet.infrastructure.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record AemetForecastData(
        @JsonProperty("prediccion") Prediccion prediccion
) {
    public record Prediccion(
            @JsonProperty("dia") List<Dia> dia
    ) {}
    public record Dia(
            @JsonProperty("fecha") String fecha,
            @JsonProperty("temperatura") Temperatura temperatura,
            @JsonProperty("probPrecipitacion") List<ProbPrecipitacion> probPrecipitacion
    ) {}
    public record Temperatura(
            @JsonProperty("maxima") Integer maxima,
            @JsonProperty("minima") Integer minima
    ) {}
    public record ProbPrecipitacion(
            @JsonProperty("value") Integer value,
            @JsonProperty("periodo") String periodo
    ) {}
}