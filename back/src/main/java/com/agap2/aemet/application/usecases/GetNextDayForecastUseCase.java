package com.agap2.aemet.application.usecases;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.TemperatureUnit;
import com.agap2.aemet.domain.repository.ForecastRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class GetNextDayForecastUseCase {

    private final ForecastRepository repository;

    public GetNextDayForecastUseCase(ForecastRepository repository) {
        this.repository = repository;
    }

    public Forecast execute(String municipalityCode, TemperatureUnit unit) {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return repository.getForecastForDate(municipalityCode, tomorrow, unit);
    }
}