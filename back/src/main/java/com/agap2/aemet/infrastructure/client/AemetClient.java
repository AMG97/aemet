package com.agap2.aemet.infrastructure.client;

import com.agap2.aemet.config.AemetProperties;
import com.agap2.aemet.infrastructure.dto.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Component
public class AemetClient {

    private final RestClient restClient;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public AemetClient(AemetProperties properties, ObjectMapper objectMapper) {
        this.restClient = RestClient.builder()
                .baseUrl(properties.baseUrl())
                .build();
        this.apiKey = properties.apiKey();
        this.objectMapper = objectMapper;
    }

    public List<AemetForecastData> getForecastDataByMunicipality(String municipalityCode) {
        AemetResponse forecastResponse = getForecastUrl(municipalityCode);
        if (forecastResponse == null || forecastResponse.datosUrl() == null) {
            return null;
        }
        return getForecastData(forecastResponse.datosUrl());
    }

    public List<AemetMunicipality> getMunicipalitiesList() {
        AemetResponse response = getMunicipalitiesUrl();
        if (response == null || response.datosUrl() == null || response.estado() != 200) {
            return List.of();
        }

        return getMunicipalitiesData(response.datosUrl());
    }

    public AemetResponse getMunicipalitiesUrl() {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/maestro/municipios")
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .body(AemetResponse.class);
    }


    public AemetResponse getForecastUrl(String municipalityCode) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/prediccion/especifica/municipio/diaria/{municipalityCode}")
                        .queryParam("api_key", apiKey)
                        .build(municipalityCode))
                .retrieve()
                .body(AemetResponse.class);
    }

    public List<AemetForecastData> getForecastData(String datosUrl) {
        String responseBody = restClient.get()
                .uri(datosUrl)
                .retrieve()
                .body(String.class);

        return objectMapper.readValue(
                responseBody,
                new TypeReference<>() {
                }
        );
    }

    public List<AemetMunicipality> getMunicipalitiesData(String url) {

        String responseBody = restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);

        return objectMapper.readValue(
                responseBody,
                new TypeReference<>() {
                }
        );
    }
}
