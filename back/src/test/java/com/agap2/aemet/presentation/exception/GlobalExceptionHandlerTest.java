package com.agap2.aemet.presentation.exception;

import com.agap2.aemet.infrastructure.exception.AemetApiException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleAemetApiError_returnsCorrectResponse() {
        AemetApiException ex = new AemetApiException(429, "Rate limited");

        ResponseEntity<Object> response = handler.handleAemetApiError(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo(429);
        assertThat(body.get("error")).isEqualTo("Too Many Requests");
        assertThat(body.get("message")).isEqualTo("Rate limited");
        assertThat(body.get("timestamp")).isNotNull();
    }

    @Test
    void handleAemetApiError_502_returnsBadGateway() {
        AemetApiException ex = new AemetApiException(502, "Bad Gateway from AEMET");

        ResponseEntity<Object> response = handler.handleAemetApiError(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_GATEWAY);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assert body != null;
        assertThat(body.get("status")).isEqualTo(502);
        assertThat(body.get("error")).isEqualTo("Bad Gateway");
        assertThat(body.get("message")).isEqualTo("Bad Gateway from AEMET");
    }

    @Test
    void handleAemetApiError_503_returnsServiceUnavailable() {
        AemetApiException ex = new AemetApiException(503, "Service unavailable");

        ResponseEntity<Object> response = handler.handleAemetApiError(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
    }

    @Test
    void handleServerError_returnsCorrectResponse() {
        // Test that 500 errors are handled
        // (HttpServerErrorException is handled by generic handler in practice)
        Exception ex = new RuntimeException("Internal server error");
        ResponseEntity<Object> response = handler.handleGeneric(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assert body != null;
        assertThat(body.get("status")).isEqualTo(500);
        assertThat(body.get("error")).isEqualTo("Internal Server Error");
    }

    @Test
    void handleServerError_500_returnsInternalServerError() {
        Exception ex = new RuntimeException("Internal server error");
        ResponseEntity<Object> response = handler.handleGeneric(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assert body != null;
        assertThat(body.get("status")).isEqualTo(500);
        assertThat(body.get("error")).isEqualTo("Internal Server Error");
    }

    @Test
    void handleIllegalArgument_returns400() {
        IllegalArgumentException ex = new IllegalArgumentException("Invalid input");

        ResponseEntity<Object> response = handler.handleIllegalArgument(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assert body != null;
        assertThat(body.get("status")).isEqualTo(400);
        assertThat(body.get("error")).isEqualTo("Bad Request");
        assertThat(body.get("message")).isEqualTo("Invalid input");
    }

    @Test
    void handleGeneric_returns500() {
        Exception ex = new RuntimeException("Unexpected error");

        ResponseEntity<Object> response = handler.handleGeneric(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assert body != null;
        assertThat(body.get("status")).isEqualTo(500);
        assertThat(body.get("error")).isEqualTo("Internal Server Error");
        assertThat(body.get("message")).isEqualTo("Unexpected error");
    }

    @Test
    void allResponses_includeTimestamp() {
        AemetApiException ex = new AemetApiException(500, "Error");
        ResponseEntity<Object> response = handler.handleAemetApiError(ex);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assert body != null;
        assertThat(body.get("timestamp")).isNotNull();
    }
}