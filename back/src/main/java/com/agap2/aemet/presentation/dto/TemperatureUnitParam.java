package com.agap2.aemet.presentation.dto;

import static com.agap2.aemet.domain.model.TemperatureUnit.CELSIUS;
import static com.agap2.aemet.domain.model.TemperatureUnit.FAHRENHEIT;

public enum TemperatureUnitParam {
    G_CEL,
    G_FAH;

    public com.agap2.aemet.domain.model.TemperatureUnit toDomain() {
        return switch (this) {
            case G_FAH -> FAHRENHEIT;
            case G_CEL -> CELSIUS;
        };
    }

    public String toApiValue() {
        return name();
    }
}