import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Municipality } from '../models/municipality';
import { Prediction } from '../models/prediction';
import { TemperatureUnit } from '../models/temperature-unit';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly backendUrl = environment.apiUrl;
  private http = inject(HttpClient);

  searchMunicipalitiesByPrefix(prefix: string): Observable<Municipality[]> {
    if (!prefix || prefix.length === 0) {
      return of([]);
    }
    return this.http.get<Municipality[]>(
      `${this.backendUrl}/api/v1/municipalities/search?prefix=${prefix}`,
    );
  }

  getForecastNextDay(municipalityCode: string, unit?: TemperatureUnit): Observable<Prediction> {
    const params: Record<string, string> = {};
    if (unit) {
      params['unit'] = unit;
    }

    return this.http.get<Prediction>(
      `${this.backendUrl}/api/v1/forecast/next-day?municipalityCode=${municipalityCode}`,
      { params },
    );
  }
}
