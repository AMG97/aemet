import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Municipality } from '../models/Municipality';
import { Pronostico, ProbPrecipitacion } from '../models/precipitation.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly backendUrl = 'http://localhost:8080';
  private http = inject(HttpClient);

  buscarMunicipios(prefix: string): Observable<Municipality[]> {
    if (!prefix || prefix.length < 2) {
      return of([]);
    }
    return this.http
      .get<Municipality[]>(`${this.backendUrl}/api/v1/municipalities/search?prefix=${prefix}`)
      .pipe(
        catchError((error) => {
          console.error('Error al buscar municipios:', error);
          return of([]);
        }),
      );
  }

  obtenerPronostico(
    codigoMunicipio: string,
    unidad?: 'G_CEL' | 'G_FAH',
  ): Observable<Pronostico | null> {
    const params: Record<string, string> = {};
    if (unidad) {
      params['unidad'] = unidad;
    }

    return this.http
      .get<Pronostico>(
        `${this.backendUrl}/api/v1/forecast/next-day?municipalityCode=${codigoMunicipio}`,
        {
          params,
        },
      )
      .pipe(
        catchError((error) => {
          console.error('Error al obtener pronóstico:', error);
          return of(null);
        }),
      );
  }
}
