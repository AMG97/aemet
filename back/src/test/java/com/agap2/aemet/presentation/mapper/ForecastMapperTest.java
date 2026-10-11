package com.agap2.aemet.presentation.mapper;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.PrecipitationProbability;
import com.agap2.aemet.presentation.dto.ForecastResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ForecastMapperTest {

    private final ForecastMapper mapper = new ForecastMapper();

    @Test
    void toResponse_celsius_withoutPrecipitation() {
        Forecast forecast = new Forecast(20.0, "CELSIUS", List.of());
        
        ForecastResponse response = mapper.toResponse(forecast);
        
        assertThat(response.averageTemperature()).isEqualTo(20.0);
        assertThat(response.temperatureUnit()).isEqualTo("G_CEL");
        assertThat(response.precipitationProbabilities()).isEmpty();
    }

    @Test
    void toResponse_fahrenheit_withoutPrecipitation() {
        Forecast forecast = new Forecast(68.0, "FAHRENHEIT", List.of());
        
        ForecastResponse response = mapper.toResponse(forecast);
        
        assertThat(response.averageTemperature()).isEqualTo(68.0);
        assertThat(response.temperatureUnit()).isEqualTo("G_FAH");
        assertThat(response.precipitationProbabilities()).isEmpty();
    }

    @Test
    void toResponse_withPrecipitation() {
        List<PrecipitationProbability> precipitation = List.of(
            new PrecipitationProbability(10, "00-06"),
            new PrecipitationProbability(20, "06-12")
        );
        Forecast forecast = new Forecast(25.0, "CELSIUS", precipitation);
        
        ForecastResponse response = mapper.toResponse(forecast);
        
        assertThat(response.precipitationProbabilities()).hasSize(2);
        assertThat(response.precipitationProbabilities().get(0).probability()).isEqualTo(10);
        assertThat(response.precipitationProbabilities().get(0).period()).isEqualTo("00-06");
        assertThat(response.precipitationProbabilities().get(1).probability()).isEqualTo(20);
        assertThat(response.precipitationProbabilities().get(1).period()).isEqualTo("06-12");
    }

    @Test
    void toResponse_nullTemperatureUnit_defaultsToGCel() {
        Forecast forecast = new Forecast(15.0, null, List.of());
        
        ForecastResponse response = mapper.toResponse(forecast);
        
        assertThat(response.temperatureUnit()).isEqualTo("G_CEL");
    }
}