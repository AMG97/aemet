import { Component, inject, signal, computed, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocationAutocomplete } from '../location-autocomplete/location-autocomplete';
import { TemperatureSelect } from '../temperature-select/temperature-select';
import { WeatherInfoComponent } from '../weather-info/weather-info';
import { PrecipitationForecastComponent } from '../precipitation-forecast/precipitation-forecast';
import { Municipality } from '../../models/Municipality';
import { Pronostico, ProbPrecipitacion } from '../../models/precipitation.model';
import { WeatherService } from '../../services/weather.service';

@Component({
  imports: [
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LocationAutocomplete,
    TemperatureSelect,
    WeatherInfoComponent,
    PrecipitationForecastComponent,
  ],
  selector: 'app-weather-widget',
  template: `
    <mat-card class="p-4 m-4 max-w-2xl" appearance="outlined">
      <mat-card-header class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <app-location-autocomplete
          class="flex-1 min-w-0"
          (municipalitySelected)="onMunicipalitySelected($event)"
        ></app-location-autocomplete>
        <app-temperature-select
          class="w-full sm:w-auto"
          (unitChanged)="onUnitChanged($event)"
        ></app-temperature-select>
      </mat-card-header>

      <mat-card-content class="flex flex-col items-center">
        <app-weather-info
          [municipalityName]="selectedMunicipalityName()"
          [temperature]="pronostico()?.mediaTemperatura ?? null"
          [unit]="selectedUnit()"
          [icon]="weatherIcon()"
        ></app-weather-info>

        <app-precipitation-forecast
          [intervals]="precipitationIntervals()"
        ></app-precipitation-forecast>

        @if (loading()) {
          <div class="flex items-center gap-2 mt-4 text-gray-600">
            <mat-spinner diameter="20"></mat-spinner>
            <span>Cargando previsión...</span>
          </div>
        }

        @if (error(); as err) {
          <div class="mt-4 text-red-600 text-center">
            <p>{{ err }}</p>
            <button
              mat-button
              color="primary"
              (click)="retryForecast()"
              class="mt-2"
            >
              Reintentar
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class WeatherWidget {
  private weatherService = inject(WeatherService);

  // State signals
  protected readonly selectedMunicipality = signal<Municipality | null>(null);
  protected readonly selectedMunicipalityName = signal<string | null>(null);
  protected readonly selectedUnit = signal<'G_CEL' | 'G_FAH' | ''>('');
  protected readonly pronostico = signal<Pronostico | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  // Computed values
  protected readonly precipitationIntervals = computed((): ProbPrecipitacion[] => {
    return this.pronostico()?.probPrecipitacion ?? [];
  });

  protected readonly weatherIcon = computed(() => {
    // Since backend doesn't provide sky state, use a default decorative icon
    return 'partly_cloudy';
  });

  // Effect to fetch forecast when municipality or unit changes
  constructor() {
    effect(() => {
      const municipio = this.selectedMunicipality();
      const unidad = this.selectedUnit();
      
      if (municipio) {
        this.fetchForecast(municipio.codigo, unidad || undefined);
      } else {
        this.pronostico.set(null);
        this.error.set(null);
      }
    });
  }

  onMunicipalitySelected(municipality: Municipality): void {
    this.selectedMunicipality.set(municipality);
    this.selectedMunicipalityName.set(municipality.nombre);
    this.error.set(null);
  }

  onUnitChanged(unit: 'G_CEL' | 'G_FAH' | ''): void {
    this.selectedUnit.set(unit);
    this.error.set(null);
  }

  private fetchForecast(codigo: string, unidad?: 'G_CEL' | 'G_FAH'): void {
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.obtenerPronostico(codigo, unidad).subscribe({
      next: (pronostico) => {
        this.loading.set(false);
        if (pronostico) {
          this.pronostico.set(pronostico);
        } else {
          this.error.set('No se pudo obtener la previsión. Inténtelo de nuevo.');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al cargar la previsión. Por favor, inténtelo de nuevo.');
      },
    });
  }

  retryForecast(): void {
    const municipio = this.selectedMunicipality();
    const unidad = this.selectedUnit();
    if (municipio) {
      this.fetchForecast(municipio.codigo, unidad || undefined);
    }
  }
}