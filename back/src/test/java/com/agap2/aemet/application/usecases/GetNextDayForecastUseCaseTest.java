package com.agap2.aemet.application.usecases;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.PrecipitationProbability;
import com.agap2.aemet.domain.model.TemperatureUnit;
import com.agap2.aemet.domain.repository.ForecastRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetNextDayForecastUseCaseTest {

    @Mock
    ForecastRepository repository;

    @Test
    void execute_celsius_delegatesToRepositoryWithTomorrow() {
        Forecast expected = new Forecast(20.0, "CELSIUS", List.of());
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        when(repository.getForecastForDate("30022", tomorrow, TemperatureUnit.CELSIUS)).thenReturn(expected);

        GetNextDayForecastUseCase useCase = new GetNextDayForecastUseCase(repository);
        Forecast result = useCase.execute("30022", TemperatureUnit.CELSIUS);

        assertThat(result).isEqualTo(expected);
        verify(repository).getForecastForDate("30022", tomorrow, TemperatureUnit.CELSIUS);
    }

    @Test
    void execute_fahrenheit_delegatesToRepositoryWithTomorrow() {
        Forecast expected = new Forecast(68.0, "FAHRENHEIT", List.of(
            new PrecipitationProbability(10, "00-06")
        ));
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        when(repository.getForecastForDate("30022", tomorrow, TemperatureUnit.FAHRENHEIT)).thenReturn(expected);

        GetNextDayForecastUseCase useCase = new GetNextDayForecastUseCase(repository);
        Forecast result = useCase.execute("30022", TemperatureUnit.FAHRENHEIT);

        assertThat(result).isEqualTo(expected);
        verify(repository).getForecastForDate("30022", tomorrow, TemperatureUnit.FAHRENHEIT);
    }
}