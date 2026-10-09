package com.agap2.aemet.infrastructure.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AemetMunicipality(
        @JsonProperty("id") String id,
        @JsonProperty("nombre") String nombre
) {
}