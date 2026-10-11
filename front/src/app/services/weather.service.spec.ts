import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WeatherService } from './weather.service';
import { Municipality } from '../models/municipality';
import { Prediction } from '../models/prediction';
import { TemperatureUnit } from '../models/temperature-unit';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const backendUrl = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('searchMunicipalitiesByPrefix', () => {
    it('should return an empty array for an empty prefix without making an HTTP request', () => {
      let result: Municipality[] | undefined;

      service.searchMunicipalitiesByPrefix('').subscribe((municipalities) => {
        result = municipalities;
      });

      expect(result).toEqual([]);
      httpMock.expectNone(`${backendUrl}/api/v1/municipalities/search?prefix=`);
    });

    it('should return an empty array for a null prefix without making an HTTP request', () => {
      let result: Municipality[] | undefined;

      service
        .searchMunicipalitiesByPrefix(null as unknown as string)
        .subscribe((municipalities) => {
          result = municipalities;
        });

      expect(result).toEqual([]);
      httpMock.expectNone(`${backendUrl}/api/v1/municipalities/search?prefix=`);
    });

    it('should search municipalities with the correct URL and return the results', () => {
      const mockMunicipalities: Municipality[] = [
        { codigo: '28079', nombre: 'Madrid' },
        { codigo: '08019', nombre: 'Barcelona' },
      ];

      let result: Municipality[] | undefined;

      service.searchMunicipalitiesByPrefix('Mad').subscribe((municipalities) => {
        result = municipalities;
      });

      const req = httpMock.expectOne(`${backendUrl}/api/v1/municipalities/search?prefix=Mad`);

      expect(req.request.method).toBe('GET');

      req.flush(mockMunicipalities);

      expect(result).toEqual(mockMunicipalities);
    });

    it('should propagate HTTP errors', () => {
      let receivedError: unknown;

      service.searchMunicipalitiesByPrefix('Madrid').subscribe({
        error: (error: unknown) => {
          receivedError = error;
        },
      });

      const req = httpMock.expectOne(`${backendUrl}/api/v1/municipalities/search?prefix=Madrid`);

      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(receivedError).toBeDefined();
      expect(receivedError).toMatchObject({ status: 500 });
    });
  });

  describe('getForecastNextDay', () => {
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

    it('should fetch the forecast using only the municipality code', () => {
      let result: Prediction | undefined;

      service.getForecastNextDay('28079').subscribe((prediction) => {
        result = prediction;
      });

      const req = httpMock.expectOne(
        `${backendUrl}/api/v1/forecast/next-day?municipalityCode=28079`,
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys()).toEqual([]);

      req.flush(mockPrediction);

      expect(result).toEqual(mockPrediction);
    });

    it('should fetch the forecast using the municipality code and temperature unit', () => {
      const unit: TemperatureUnit = 'G_FAH';
      let result: Prediction | undefined;

      service.getForecastNextDay('28079', unit).subscribe((prediction) => {
        result = prediction;
      });

      const req = httpMock.expectOne(
        `${backendUrl}/api/v1/forecast/next-day?municipalityCode=28079&unit=G_FAH`,
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('unit')).toBe(unit);

      req.flush(mockPrediction);

      expect(result).toEqual(mockPrediction);
    });

    it('should propagate HTTP errors', () => {
      let receivedError: unknown;

      service.getForecastNextDay('28079').subscribe({
        error: (error: unknown) => {
          receivedError = error;
        },
      });

      const req = httpMock.expectOne(
        `${backendUrl}/api/v1/forecast/next-day?municipalityCode=28079`,
      );

      req.flush('Not found', {
        status: 404,
        statusText: 'Not Found',
      });

      expect(receivedError).toBeDefined();
      expect(receivedError).toMatchObject({ status: 404 });
    });
  });
});
