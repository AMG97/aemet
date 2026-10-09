package com.agap2.aemet;

import com.agap2.aemet.config.AemetProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({AemetProperties.class})
public class AemetApplication {

	public static void main(String[] args) {
		SpringApplication.run(AemetApplication.class, args);
	}
}
