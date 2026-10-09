package com.agap2.aemet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "aemet")
public record AemetProperties(
        String apiKey,
        String baseUrl
) {
}