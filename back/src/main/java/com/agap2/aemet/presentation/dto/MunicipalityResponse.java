package com.agap2.aemet.presentation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MunicipalityResponse(
        @JsonProperty("codigo") String code,
        @JsonProperty("nombre") String name
) {
}