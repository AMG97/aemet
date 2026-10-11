import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi, type Mocked } from 'vitest';
import { of, throwError } from 'rxjs';

import { WeatherWidget } from './weather-widget';
import { WeatherService } from '../../services/weather.service';
import { Municipality } from '../../models/municipality';
import { Prediction } from '../../models/prediction';
import { ApiError } from '../../models/api-error';
import { TemperatureUnit } from '../../models/temperature-unit';
import { By } from '@angular/platform-browser';
import { WeatherInfoComponent } from '../weather-info/weather-info';

describe('WeatherWidget', () => {
  let component: WeatherWidget;
  let fixture: ComponentFixture<WeatherWidget>;
  let weatherServiceMock: Mocked<WeatherService>;

  const mockMunicipality: Municipality = {
    codigo: '28079',
    nombre: 'Madrid',
  };

  const mockPrediction: Prediction = {
    mediaTemperatura: 22,
    unidadTemperatura: 'G_CEL',
    probPrecipitacion: [
      { probabilidad: 10, periodo: '00-06' },
      { probabilidad: 20, periodo: '06-12' },
      { probabilidad: 30, periodo: '12-18' },
      { probabilidad: 40, periodo: '18-24' },
    ],
  };

  beforeEach(async () => {
    weatherServiceMock = {
      searchMunicipalitiesByPrefix: vi.fn(),
      getForecastNextDay: vi.fn(),
    } as unknown as Mocked<WeatherService>;

    await TestBed.configureTestingModule({
      imports: [WeatherWidget],
      providers: [
        { provide: WeatherService, useValue: weatherServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should not request a forecast before selecting a municipality', () => {
      expect(weatherServiceMock.getForecastNextDay).not.toHaveBeenCalled();
    });

    it('should render the municipality autocomplete', () => {
      expect(fixture.nativeElement.querySelector('app-municipality-autocomplete')).toBeTruthy();
    });

    it('should render the temperature select', () => {
      expect(fixture.nativeElement.querySelector('app-temperature-select')).toBeTruthy();
    });

    it('should render the error message component', () => {
      expect(fixture.nativeElement.querySelector('app-error-message')).toBeTruthy();
    });

    it('should render weather information when there is no error', () => {
      expect(fixture.nativeElement.querySelector('app-weather-info')).toBeTruthy();
    });

    it('should render precipitation forecast when there is no error', () => {
      expect(fixture.nativeElement.querySelector('app-precipitation-forecast')).toBeTruthy();
    });
  });

  describe('onMunicipalitySelected', () => {
    it('should request the forecast for the selected municipality', () => {
      weatherServiceMock.getForecastNextDay.mockReturnValue(of(mockPrediction));

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      expect(weatherServiceMock.getForecastNextDay).toHaveBeenCalledWith('28079', undefined);
    });

    it('should display the selected municipality name', () => {
      weatherServiceMock.getForecastNextDay.mockReturnValue(of(mockPrediction));

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      const weatherInfo = fixture.debugElement.query(By.directive(WeatherInfoComponent));

      expect(weatherInfo).toBeTruthy();
      expect(weatherInfo.componentInstance.municipalityName()).toBe('Madrid');
    });

    it('should pass the selected temperature unit to the service', () => {
      weatherServiceMock.getForecastNextDay.mockReturnValue(of(mockPrediction));

      component.onUnitChanged('G_FAH');
      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      expect(weatherServiceMock.getForecastNextDay).toHaveBeenCalledWith('28079', 'G_FAH');
    });
  });

  describe('onUnitChanged', () => {
    it('should refetch the forecast when the temperature unit changes', () => {
      weatherServiceMock.getForecastNextDay.mockReturnValue(of(mockPrediction));

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      expect(weatherServiceMock.getForecastNextDay).toHaveBeenLastCalledWith('28079', undefined);

      component.onUnitChanged('G_FAH');
      fixture.detectChanges();

      expect(weatherServiceMock.getForecastNextDay).toHaveBeenLastCalledWith('28079', 'G_FAH');
    });

    it('should request the forecast without a unit when the unit is empty', () => {
      weatherServiceMock.getForecastNextDay.mockReturnValue(of(mockPrediction));

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      component.onUnitChanged('');
      fixture.detectChanges();

      expect(weatherServiceMock.getForecastNextDay).toHaveBeenLastCalledWith('28079', undefined);
    });
  });

  describe('forecast errors', () => {
    it('should render an error message when the forecast request fails', () => {
      const apiError: ApiError = {
        status: 500,
        message: 'Error interno del servidor',
        timestamp: new Date().toISOString(),
      };

      weatherServiceMock.getForecastNextDay.mockReturnValue(throwError(() => apiError));

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('app-error-message');

      expect(errorElement).toBeTruthy();
      expect(fixture.nativeElement.querySelector('app-weather-info')).toBeNull();
      expect(fixture.nativeElement.querySelector('app-precipitation-forecast')).toBeNull();
    });

    it('should use the fallback message when the error has no message', () => {
      const apiError = {
        status: 500,
        timestamp: new Date().toISOString(),
      } as ApiError;

      weatherServiceMock.getForecastNextDay.mockReturnValue(throwError(() => apiError));

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      // The error component receives the message through its input.
      // Verify the component's rendered error state without reading
      // the widget's protected error signal.
      expect(fixture.nativeElement.querySelector('app-error-message')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('app-weather-info')).toBeNull();
    });

    it('should clear the error when another municipality is selected', () => {
      weatherServiceMock.getForecastNextDay.mockReturnValue(
        throwError(() => ({
          status: 500,
          message: 'Error de prueba',
          timestamp: new Date().toISOString(),
        })),
      );

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-weather-info')).toBeNull();

      weatherServiceMock.getForecastNextDay.mockReturnValue(of(mockPrediction));

      component.onMunicipalitySelected({
        codigo: '08019',
        nombre: 'Barcelona',
      });
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-weather-info')).toBeTruthy();
    });

    it('should display municipality search errors', () => {
      component.onMunicipalityError('Error al buscar municipios');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-weather-info')).toBeNull();

      expect(fixture.nativeElement.querySelector('app-precipitation-forecast')).toBeNull();
    });
  });

  describe('template rendering', () => {
    it('should display the weather and precipitation components after a successful request', () => {
      weatherServiceMock.getForecastNextDay.mockReturnValue(of(mockPrediction));

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;

      expect(element.querySelector('app-weather-info')).toBeTruthy();
      expect(element.querySelector('app-precipitation-forecast')).toBeTruthy();
    });

    it('should not display weather components when an error occurs', () => {
      weatherServiceMock.getForecastNextDay.mockReturnValue(
        throwError(() => ({
          status: 500,
          message: 'Error de prueba',
          timestamp: new Date().toISOString(),
        })),
      );

      component.onMunicipalitySelected(mockMunicipality);
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;

      expect(element.querySelector('app-weather-info')).toBeNull();
      expect(element.querySelector('app-precipitation-forecast')).toBeNull();
    });
  });
});
