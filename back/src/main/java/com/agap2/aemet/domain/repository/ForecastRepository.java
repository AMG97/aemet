package com.agap2.aemet.domain.repository;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.TemperatureUnit;
import java.time.LocalDate;

public interface ForecastRepository {
    Forecast getForecastForDate(String municipalityCode, LocalDate date, TemperatureUnit unit);
}