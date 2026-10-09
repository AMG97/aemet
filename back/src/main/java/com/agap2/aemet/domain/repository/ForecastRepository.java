package com.agap2.aemet.domain.repository;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.TemperatureUnit;

public interface ForecastRepository {
    Forecast getNextDayForecast(String municipalityCode, TemperatureUnit unit);
}