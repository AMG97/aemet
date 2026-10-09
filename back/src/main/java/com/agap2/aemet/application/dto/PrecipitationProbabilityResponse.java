package com.agap2.aemet.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PrecipitationProbabilityResponse(
        @JsonProperty("probabilidad") Integer probability,
        @JsonProperty("periodo") String period
) {
}