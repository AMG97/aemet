package com.agap2.aemet.application.usecases;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.TemperatureUnit;
import com.agap2.aemet.domain.repository.ForecastRepository;
import org.springframework.stereotype.Service;

@Service
public class GetNextDayForecastUseCase {

    private final ForecastRepository repository;

    public GetNextDayForecastUseCase(ForecastRepository repository) {
        this.repository = repository;
    }

    public Forecast execute(String municipalityCode, TemperatureUnit unit) {
        return repository.getNextDayForecast(municipalityCode, unit);
    }
}