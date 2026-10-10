package com.agap2.aemet.infrastructure.exception;

public class AemetApiException extends RuntimeException {
    private final int statusCode;
    private final String responseBody;

    public AemetApiException(int statusCode, String responseBody) {
        super("AEMET API error: " + statusCode + " - " + responseBody);
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getResponseBody() {
        return responseBody;
    }
}