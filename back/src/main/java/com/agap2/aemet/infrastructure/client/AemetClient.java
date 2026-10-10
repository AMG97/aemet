package com.agap2.aemet.infrastructure.client;

import com.agap2.aemet.config.AemetProperties;
import com.agap2.aemet.infrastructure.dto.*;
import com.agap2.aemet.infrastructure.exception.AemetApiException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.function.Supplier;

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
            throw new AemetApiException(502, "Invalid forecast response from AEMET");
        }
        return getForecastData(forecastResponse.datosUrl());
    }

    public List<AemetMunicipality> getMunicipalitiesList() {
        AemetResponse response = getMunicipalitiesUrl();
        if (response == null || response.datosUrl() == null) {
            throw new AemetApiException(502, "Invalid municipalities response from AEMET");
        }
        if (response.estado() != 200) {
            throw new AemetApiException(response.estado(), response.descripcion());
        }
        return getMunicipalitiesData(response.datosUrl());
    }

    public AemetResponse getMunicipalitiesUrl() {
        return callApi(() -> restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/maestro/municipios")
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        (request, response) -> handleError(response))
                .body(AemetResponse.class));
    }

    public AemetResponse getForecastUrl(String municipalityCode) {
        return callApi(() -> restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/prediccion/especifica/municipio/diaria/{municipalityCode}")
                        .queryParam("api_key", apiKey)
                        .build(municipalityCode))
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        (request, response) -> handleError(response))
                .body(AemetResponse.class));
    }

    public List<AemetForecastData> getForecastData(String datosUrl) {
        return callApi(() -> {
            String responseBody = restClient.get()
                    .uri(datosUrl)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            (request, response) -> handleError(response))
                    .body(String.class);
            return objectMapper.readValue(responseBody, new TypeReference<>() {});
        });
    }

    public List<AemetMunicipality> getMunicipalitiesData(String url) {
        return callApi(() -> {
            String responseBody = restClient.get()
                    .uri(url)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            (request, response) -> handleError(response))
                    .body(String.class);
            return objectMapper.readValue(responseBody, new TypeReference<>() {});
        });
    }

    private <T> T callApi(Supplier<T> supplier) {
        try {
            return supplier.get();
        } catch (AemetApiException e) {
            throw e;
        } catch (Exception e) {
            throw new AemetApiException(503, "AEMET service unavailable: " + e.getMessage());
        }
    }

    private void handleError(org.springframework.http.client.ClientHttpResponse response) throws java.io.IOException {
        int statusCode = response.getStatusCode().value();
        String responseBody;

        try {
            responseBody = new String(response.getBody().readAllBytes());
        } catch (Exception e) {
            responseBody = "Unable to read response body";
        }

        throw new AemetApiException(statusCode, responseBody);
    }
}