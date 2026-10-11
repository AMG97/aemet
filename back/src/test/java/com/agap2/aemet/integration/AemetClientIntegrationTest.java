package com.agap2.aemet.integration;

import com.agap2.aemet.config.AemetProperties;
import com.agap2.aemet.infrastructure.client.AemetClient;
import com.agap2.aemet.infrastructure.dto.AemetForecastData;
import com.agap2.aemet.infrastructure.dto.AemetMunicipality;
import com.agap2.aemet.infrastructure.dto.AemetResponse;
import com.agap2.aemet.infrastructure.exception.AemetApiException;
import tools.jackson.databind.ObjectMapper;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AemetClientIntegrationTest {

    private static MockWebServer mockWebServer;
    private AemetClient client;
    private ObjectMapper objectMapper;

    @BeforeAll
    static void setUpServer() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void tearDownServer() throws IOException {
        mockWebServer.shutdown();
    }

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        AemetProperties properties = new AemetProperties("test-api-key", mockWebServer.url("/").toString());
        client = new AemetClient(properties, objectMapper);
    }

    @Test
    void getMunicipalitiesList_returnsMappedMunicipalities() {
        String datosUrl = mockWebServer.url("/municipios-data").toString();
        
        AemetResponse metadataResponse = new AemetResponse("OK", 200, datosUrl);
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(metadataResponse)));

        List<AemetMunicipality> expectedMunicipalities = List.of(
            new AemetMunicipality("id30022", "Jumilla"),
            new AemetMunicipality("id18111", "Jun")
        );
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(expectedMunicipalities)));

        List<AemetMunicipality> result = client.getMunicipalitiesList();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).id()).isEqualTo("id30022");
        assertThat(result.get(0).nombre()).isEqualTo("Jumilla");
        assertThat(result.get(1).id()).isEqualTo("id18111");
        assertThat(result.get(1).nombre()).isEqualTo("Jun");
    }

    @Test
    void getMunicipalitiesList_emptyResponse_returnsEmptyList() {
        String datosUrl = mockWebServer.url("/municipios-data").toString();
        
        AemetResponse metadataResponse = new AemetResponse("OK", 200, datosUrl);
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(metadataResponse)));

        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(List.of())));

        List<AemetMunicipality> result = client.getMunicipalitiesList();

        assertThat(result).isEmpty();
    }

    @Test
    void getMunicipalitiesList_4xxError_throwsAemetApiException() {
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(400)
            .setBody("Bad Request"));

        assertThatThrownBy(() -> client.getMunicipalitiesList())
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 400);
    }

    @Test
    void getMunicipalitiesList_5xxError_throwsAemetApiException() {
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(500)
            .setBody("Internal Server Error"));

        assertThatThrownBy(() -> client.getMunicipalitiesList())
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 500);
    }

    @Test
    void getMunicipalitiesList_invalidMetadataJson_throwsException() {
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody("invalid json"));

        assertThatThrownBy(() -> client.getMunicipalitiesList())
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 503);
    }

    @Test
    void getMunicipalitiesList_invalidDataJson_throwsException() {
        String datosUrl = mockWebServer.url("/municipios-data").toString();
        
        AemetResponse metadataResponse = new AemetResponse("OK", 200, datosUrl);
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(metadataResponse)));

        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody("invalid json"));

        assertThatThrownBy(() -> client.getMunicipalitiesList())
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 503);
    }

    @Test
    void getMunicipalitiesList_nullDatosUrl_throwsException() {
        AemetResponse metadataResponse = new AemetResponse("OK", 200, null);
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(metadataResponse)));

        assertThatThrownBy(() -> client.getMunicipalitiesList())
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 502);
    }

    @Test
    void getForecastDataByMunicipality_returnsForecastData() {
        String datosUrl = mockWebServer.url("/forecast-data").toString();

        AemetResponse forecastMetadata = new AemetResponse("OK", 200, datosUrl);
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(forecastMetadata)));

        AemetForecastData.Prediccion prediccion = new AemetForecastData.Prediccion(List.of(
            new AemetForecastData.Dia(
                "2024-01-15",
                new AemetForecastData.Temperatura(20, 10),
                List.of(new AemetForecastData.ProbPrecipitacion(80, "00-24"))
            )
        ));
        List<AemetForecastData> expectedForecasts = List.of(
            new AemetForecastData(prediccion)
        );
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(expectedForecasts)));

        List<AemetForecastData> result = client.getForecastDataByMunicipality("30022");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).prediccion().dia().get(0).fecha()).isEqualTo("2024-01-15");
        assertThat(result.get(0).prediccion().dia().get(0).temperatura().maxima()).isEqualTo(20);
        assertThat(result.get(0).prediccion().dia().get(0).temperatura().minima()).isEqualTo(10);
        assertThat(result.get(0).prediccion().dia().get(0).probPrecipitacion().get(0).value()).isEqualTo(80);
    }

    @Test
    void getForecastDataByMunicipality_4xxError_throwsAemetApiException() {
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(404)
            .setBody("Not Found"));

        assertThatThrownBy(() -> client.getForecastDataByMunicipality("99999"))
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 404);
    }
}