package com.agap2.aemet.infrastructure.repository;

import com.agap2.aemet.domain.model.Forecast;
import com.agap2.aemet.domain.model.PrecipitationProbability;
import com.agap2.aemet.domain.model.TemperatureUnit;
import com.agap2.aemet.infrastructure.client.AemetClient;
import com.agap2.aemet.infrastructure.dto.AemetForecastData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.lang.reflect.Method;
import java.time.LocalDate;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AemetForecastRepositoryImplTest {

    @Mock
    AemetClient aemetClient;

    AemetForecastRepositoryImpl repository;

    AemetMunicipalityRepositoryImpl municipalityRepository;

    @BeforeEach
    void setUp() {
        repository = new AemetForecastRepositoryImpl(aemetClient);
        municipalityRepository = new AemetMunicipalityRepositoryImpl(aemetClient);
    }

    private Double invokeCalculateAverageTemperature(AemetForecastData.Temperatura temperatura, TemperatureUnit unit) throws Exception {
        Method method = AemetForecastRepositoryImpl.class.getDeclaredMethod("calculateAverageTemperature", AemetForecastData.Temperatura.class, TemperatureUnit.class);
        method.setAccessible(true);
        return (Double) method.invoke(repository, temperatura, unit);
    }

    private String invokeExtractCode(String id) throws Exception {
        Method method = AemetMunicipalityRepositoryImpl.class.getDeclaredMethod("extractCode", String.class);
        method.setAccessible(true);
        return (String) method.invoke(municipalityRepository, id);
    }

    @Test
    void getForecastForDate_filtersForCorrectDate() {
        LocalDate targetDate = LocalDate.of(2026, 10, 12);
        
        AemetForecastData.Dia dia = new AemetForecastData.Dia(
            "2026-10-12T00:00:00",
            new AemetForecastData.Temperatura(25, 15),
            List.of(new AemetForecastData.ProbPrecipitacion(10, "00-06"))
        );
        
        AemetForecastData.Prediccion prediccion = new AemetForecastData.Prediccion(List.of(dia));
        AemetForecastData forecastData = new AemetForecastData(prediccion);
        
        when(aemetClient.getForecastDataByMunicipality("30022"))
            .thenReturn(List.of(forecastData));

        Forecast result = repository.getForecastForDate("30022", targetDate, TemperatureUnit.CELSIUS);

        assertThat(result.averageTemperature()).isEqualTo(20.0); // (25+15)/2
        assertThat(result.temperatureUnit()).isEqualTo("CELSIUS");
        assertThat(result.precipitationProbabilities()).hasSize(1);
        assertThat(result.precipitationProbabilities().get(0).probability()).isEqualTo(10);
        assertThat(result.precipitationProbabilities().get(0).period()).isEqualTo("00-06");
    }

    @Test
    void getForecastForDate_fahrenheit_convertsTemperature() {
        LocalDate targetDate = LocalDate.of(2026, 10, 12);
        
        AemetForecastData.Dia dia = new AemetForecastData.Dia(
            "2026-10-12T00:00:00",
            new AemetForecastData.Temperatura(25, 15), // 20°C avg
            List.of()
        );
        
        AemetForecastData.Prediccion prediccion = new AemetForecastData.Prediccion(List.of(dia));
        AemetForecastData forecastData = new AemetForecastData(prediccion);
        
        when(aemetClient.getForecastDataByMunicipality("30022"))
            .thenReturn(List.of(forecastData));

        Forecast result = repository.getForecastForDate("30022", targetDate, TemperatureUnit.FAHRENHEIT);

        assertThat(result.averageTemperature()).isEqualTo(68.0); // 20°C = 68°F
        assertThat(result.temperatureUnit()).isEqualTo("FAHRENHEIT");
    }

    @Test
    void getForecastForDate_noMatchingDate_returnsEmptyForecast() {
        LocalDate targetDate = LocalDate.of(2026, 10, 12);
        
        // AEMET returns data for different date
        AemetForecastData.Dia dia = new AemetForecastData.Dia(
            "2026-10-11T00:00:00",
            new AemetForecastData.Temperatura(25, 15),
            List.of()
        );
        
        AemetForecastData.Prediccion prediccion = new AemetForecastData.Prediccion(List.of(dia));
        AemetForecastData forecastData = new AemetForecastData(prediccion);
        
        when(aemetClient.getForecastDataByMunicipality("30022"))
            .thenReturn(List.of(forecastData));

        Forecast result = repository.getForecastForDate("30022", targetDate, TemperatureUnit.CELSIUS);

        assertThat(result.averageTemperature()).isEqualTo(0.0);
        assertThat(result.precipitationProbabilities()).isEmpty();
    }

    @Test
    void getForecastForDate_missingTemperature_returnsZero() {
        LocalDate targetDate = LocalDate.of(2026, 10, 12);
        
        AemetForecastData.Dia dia = new AemetForecastData.Dia(
            "2026-10-12T00:00:00",
            null, // missing temperature
            List.of()
        );
        
        AemetForecastData.Prediccion prediccion = new AemetForecastData.Prediccion(List.of(dia));
        AemetForecastData forecastData = new AemetForecastData(prediccion);
        
        when(aemetClient.getForecastDataByMunicipality("30022"))
            .thenReturn(List.of(forecastData));

        Forecast result = repository.getForecastForDate("30022", targetDate, TemperatureUnit.CELSIUS);

        assertThat(result.averageTemperature()).isEqualTo(0.0);
    }

    @Test
    void getForecastForDate_filtersSixHourPeriodsOnly() {
        LocalDate targetDate = LocalDate.of(2026, 10, 12);
        
        AemetForecastData.Dia dia = new AemetForecastData.Dia(
            "2026-10-12T00:00:00",
            new AemetForecastData.Temperatura(25, 15),
            List.of(
                new AemetForecastData.ProbPrecipitacion(10, "00-06"),   // valid
                new AemetForecastData.ProbPrecipitacion(20, "06-12"),   // valid
                new AemetForecastData.ProbPrecipitacion(30, "12-18"),   // valid
                new AemetForecastData.ProbPrecipitacion(40, "18-24"),   // valid
                new AemetForecastData.ProbPrecipitacion(50, "24-00"),   // invalid - not 6h period
                new AemetForecastData.ProbPrecipitacion(60, "00-12"),   // invalid - not 6h period
                new AemetForecastData.ProbPrecipitacion(null, "00-06"), // invalid - null value
                new AemetForecastData.ProbPrecipitacion(70, null)       // invalid - null period
            )
        );
        
        AemetForecastData.Prediccion prediccion = new AemetForecastData.Prediccion(List.of(dia));
        AemetForecastData forecastData = new AemetForecastData(prediccion);
        
        when(aemetClient.getForecastDataByMunicipality("30022"))
            .thenReturn(List.of(forecastData));

        Forecast result = repository.getForecastForDate("30022", targetDate, TemperatureUnit.CELSIUS);

        assertThat(result.precipitationProbabilities()).hasSize(4);
        assertThat(result.precipitationProbabilities())
            .extracting(PrecipitationProbability::probability)
            .containsExactly(10, 20, 30, 40);
    }

    @Test
    void getForecastForDate_nullProbabilities_returnsEmpty() {
        LocalDate targetDate = LocalDate.of(2026, 10, 12);
        
        AemetForecastData.Dia dia = new AemetForecastData.Dia(
            "2026-10-12T00:00:00",
            new AemetForecastData.Temperatura(25, 15),
            null
        );
        
        AemetForecastData.Prediccion prediccion = new AemetForecastData.Prediccion(List.of(dia));
        AemetForecastData forecastData = new AemetForecastData(prediccion);
        
        when(aemetClient.getForecastDataByMunicipality("30022"))
            .thenReturn(List.of(forecastData));

        Forecast result = repository.getForecastForDate("30022", targetDate, TemperatureUnit.CELSIUS);

        assertThat(result.precipitationProbabilities()).isEmpty();
    }

    // Private method tests for branch coverage
    @Test
    void calculateAverageTemperature_nullTemperatura_returnsZero() throws Exception {
        Double result = invokeCalculateAverageTemperature(null, TemperatureUnit.CELSIUS);
        assertThat(result).isEqualTo(0.0);
    }

    @Test
    void calculateAverageTemperature_nullMaxima_returnsZero() throws Exception {
        AemetForecastData.Temperatura temp = new AemetForecastData.Temperatura(null, 15);
        Double result = invokeCalculateAverageTemperature(temp, TemperatureUnit.CELSIUS);
        assertThat(result).isEqualTo(0.0);
    }

    @Test
    void calculateAverageTemperature_nullMinima_returnsZero() throws Exception {
        AemetForecastData.Temperatura temp = new AemetForecastData.Temperatura(25, null);
        Double result = invokeCalculateAverageTemperature(temp, TemperatureUnit.CELSIUS);
        assertThat(result).isEqualTo(0.0);
    }

    @Test
    void extractCode_nullId_returnsEmpty() throws Exception {
        String result = invokeExtractCode(null);
        assertThat(result).isEmpty();
    }

    @Test
    void extractCode_validId_removesPrefix() throws Exception {
        String result = invokeExtractCode("id30022");
        assertThat(result).isEqualTo("30022");
    }

    @Test
    void extractCode_idWithoutPrefix_returnsAsIs() throws Exception {
        String result = invokeExtractCode("30022");
        assertThat(result).isEqualTo("30022");
    }
}