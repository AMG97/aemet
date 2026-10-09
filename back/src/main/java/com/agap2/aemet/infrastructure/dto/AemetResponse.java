package com.agap2.aemet.infrastructure.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AemetResponse(
        @JsonProperty("descripcion") String descripcion,
        @JsonProperty("estado") Integer estado,
        @JsonProperty("datos") String datosUrl
) {
}