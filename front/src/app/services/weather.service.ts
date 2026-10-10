import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Municipality } from '../models/municipality';
import { Prediction } from '../models/prediction';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly backendUrl = 'http://localhost:8080';
  private http = inject(HttpClient);

  buscarMunicipios(prefix: string): Observable<Municipality[]> {
    if (!prefix || prefix.length < 2) {
      return of([]);
    }
    return this.http.get<Municipality[]>(
      `${this.backendUrl}/api/v1/municipalities/search?prefix=${prefix}`,
    );
  }

  obtenerPronostico(codigoMunicipio: string, unidad?: 'G_CEL' | 'G_FAH'): Observable<Prediction> {
    const params: Record<string, string> = {};
    if (unidad) {
      params['unit'] = unidad;
    }

    return this.http.get<Prediction>(
      `${this.backendUrl}/api/v1/forecast/next-day?municipalityCode=${codigoMunicipio}`,
      { params },
    );
  }
}
