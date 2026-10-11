package com.agap2.aemet.presentation.controller;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.PrecipitationProbability;
import com.agap2.aemet.application.usecases.GetNextDayForecastUseCase;
import com.agap2.aemet.domain.model.TemperatureUnit;
import com.agap2.aemet.presentation.dto.ForecastResponse;
import com.agap2.aemet.presentation.dto.PrecipitationProbabilityResponse;
import com.agap2.aemet.presentation.mapper.ForecastMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ForecastController.class)
class ForecastControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    GetNextDayForecastUseCase useCase;

    @MockitoBean
    ForecastMapper forecastMapper;

    @Test
    void nextDay_returnsForecast() throws Exception {
        Forecast forecast = new Forecast(20.0, "CELSIUS", List.of(
            new PrecipitationProbability(10, "00-06"),
            new PrecipitationProbability(20, "06-12")
        ));
        ForecastResponse response = new ForecastResponse(
            20.0, "G_CEL", List.of(
                new PrecipitationProbabilityResponse(10, "00-06"),
                new PrecipitationProbabilityResponse(20, "06-12")
            )
        );
        when(useCase.execute("28079", TemperatureUnit.CELSIUS)).thenReturn(forecast);
        when(forecastMapper.toResponse(any(Forecast.class))).thenReturn(response);

        mockMvc.perform(get("/api/v1/forecast/next-day")
                .param("municipalityCode", "28079"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.mediaTemperatura").value(20.0))
            .andExpect(jsonPath("$.unidadTemperatura").value("G_CEL"))
            .andExpect(jsonPath("$.probPrecipitacion[0].probabilidad").value(10))
            .andExpect(jsonPath("$.probPrecipitacion[0].periodo").value("00-06"))
            .andExpect(jsonPath("$.probPrecipitacion[1].probabilidad").value(20));
    }

    @Test
    void nextDay_withFahrenheit_returnsG_FAH() throws Exception {
        Forecast forecast = new Forecast(68.0, "FAHRENHEIT", List.of());
        ForecastResponse response = new ForecastResponse(68.0, "G_FAH", List.of());
        when(useCase.execute("28079", TemperatureUnit.FAHRENHEIT)).thenReturn(forecast);
        when(forecastMapper.toResponse(any(Forecast.class))).thenReturn(response);

        mockMvc.perform(get("/api/v1/forecast/next-day")
                .param("municipalityCode", "28079")
                .param("unit", "G_FAH"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.unidadTemperatura").value("G_FAH"));
    }

    @Test
    void nextDay_missingMunicipalityCode_returns400() throws Exception {
        mockMvc.perform(get("/api/v1/forecast/next-day"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void nextDay_defaultUnit_isCelsius() throws Exception {
        Forecast forecast = new Forecast(15.0, "CELSIUS", List.of());
        ForecastResponse response = new ForecastResponse(15.0, "G_CEL", List.of());
        when(useCase.execute("28079", TemperatureUnit.CELSIUS)).thenReturn(forecast);
        when(forecastMapper.toResponse(any(Forecast.class))).thenReturn(response);

        mockMvc.perform(get("/api/v1/forecast/next-day")
                .param("municipalityCode", "28079"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.unidadTemperatura").value("G_CEL"));
    }
}