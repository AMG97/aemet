package com.agap2.aemet.infrastructure.client;

import com.agap2.aemet.config.AemetProperties;
import com.agap2.aemet.infrastructure.exception.AemetApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AemetClientTest {

    @Mock
    AemetProperties properties;

    AemetClient client;

    @BeforeEach
    void setUp() {
        when(properties.baseUrl()).thenReturn("https://opendata.aemet.es");
        when(properties.apiKey()).thenReturn("test-api-key");
        client = new AemetClient(properties, new tools.jackson.databind.ObjectMapper());
    }

    @Test
    void handleError_4xx_throwsAemetApiException() throws IOException {
        ClientHttpResponse response = mock(ClientHttpResponse.class);
        when(response.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);
        when(response.getBody()).thenReturn(new ByteArrayInputStream("Bad Request".getBytes(StandardCharsets.UTF_8)));

        assertThatThrownBy(() -> client.handleError(response))
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 400)
            .hasFieldOrPropertyWithValue("responseBody", "Bad Request");
    }

    @Test
    void handleError_5xx_throwsAemetApiException() throws IOException {
        ClientHttpResponse response = mock(ClientHttpResponse.class);
        when(response.getStatusCode()).thenReturn(HttpStatus.INTERNAL_SERVER_ERROR);
        when(response.getBody()).thenReturn(new ByteArrayInputStream("Server Error".getBytes(StandardCharsets.UTF_8)));

        assertThatThrownBy(() -> client.handleError(response))
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 500);
    }

    @Test
    void handleError_readBodyFailure_usesDefaultMessage() throws IOException {
        ClientHttpResponse response = mock(ClientHttpResponse.class);
        when(response.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);
        when(response.getBody()).thenThrow(new IOException("Stream closed"));

        assertThatThrownBy(() -> client.handleError(response))
            .isInstanceOf(AemetApiException.class)
            .hasFieldOrPropertyWithValue("statusCode", 400)
            .hasFieldOrPropertyWithValue("responseBody", "Unable to read response body");
    }
}