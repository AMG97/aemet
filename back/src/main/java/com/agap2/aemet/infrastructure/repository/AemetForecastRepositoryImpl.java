package com.agap2.aemet.infrastructure.repository;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.PrecipitationProbability;
import com.agap2.aemet.domain.model.TemperatureUnit;
import com.agap2.aemet.domain.repository.ForecastRepository;
import com.agap2.aemet.infrastructure.client.AemetClient;
import com.agap2.aemet.infrastructure.dto.AemetForecastData;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class AemetForecastRepositoryImpl implements ForecastRepository {

    private static final List<String> SIX_HOUR_PERIODS =
            List.of("00-06", "06-12", "12-18", "18-24");

    private final AemetClient aemetClient;

    public AemetForecastRepositoryImpl(AemetClient aemetClient) {
        this.aemetClient = aemetClient;
    }

    @Override
    public Forecast getNextDayForecast(String municipalityCode, TemperatureUnit unit) {
        AemetForecastData forecastData = aemetClient.getForecastDataByMunicipality(municipalityCode).get(0);
        if (forecastData == null || forecastData.prediccion() == null || forecastData.prediccion().dia() == null) {
            return new Forecast(0.0, unit.name(), List.of());
        }

        LocalDate tomorrow = LocalDate.now().plusDays(1);

        Optional<AemetForecastData.Dia> tomorrowForecast = forecastData.prediccion().dia().stream()
                .filter(dia -> {
                    LocalDate diaFecha = LocalDate.parse(dia.fecha().split("T")[0]);
                    return tomorrow.isEqual(diaFecha);

                })
                .findFirst();

        if (tomorrowForecast.isEmpty()) {
            return new Forecast(0.0, unit.name(), List.of());
        }

        AemetForecastData.Dia dia = tomorrowForecast.get();
        Double avgTemp = calculateAverageTemperature(dia.temperatura(), unit);
        List<PrecipitationProbability> probabilities = mapProbabilities(dia.probPrecipitacion());

        return new Forecast(avgTemp, unit.name(), probabilities);
    }

    private Double calculateAverageTemperature(AemetForecastData.Temperatura temperatura, TemperatureUnit unit) {
        if (temperatura == null || temperatura.maxima() == null || temperatura.minima() == null) {
            return 0.0;
        }
        double avgCelsius = (temperatura.maxima() + temperatura.minima()) / 2.0;
        if (unit == TemperatureUnit.FAHRENHEIT) {
            return Math.round((avgCelsius * 9.0 / 5.0 + 32.0) * 10.0) / 10.0;
        }
        return Math.round(avgCelsius * 10.0) / 10.0;
    }

    private List<PrecipitationProbability> mapProbabilities(List<AemetForecastData.ProbPrecipitacion> probabilities) {
        if (probabilities == null) {
            return List.of();
        }
        return probabilities.stream()
                .filter(p -> p.value() != null && p.periodo() != null)
                .filter(p -> SIX_HOUR_PERIODS.contains(p.periodo()))
                .map(p -> new PrecipitationProbability(p.value(), p.periodo()))
                .toList();
    }
}