import { Component, inject, signal, computed, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MunicipalityAutocomplete } from '../municipality-autocomplete/municipality-autocomplete';
import { TemperatureSelect } from '../temperature-select/temperature-select';
import { WeatherInfoComponent } from '../weather-info/weather-info';
import { PrecipitationForecastComponent } from '../precipitation-forecast/precipitation-forecast';
import { Municipality } from '../../models/municipality';
import { Prediction, PrecipitationProbability } from '../../models/prediction';
import { ApiError } from '../../models/api-error';
import { TemperatureUnit } from '../../models/temperature-unit';
import { WeatherService } from '../../services/weather.service';

@Component({
  imports: [
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MunicipalityAutocomplete,
    TemperatureSelect,
    WeatherInfoComponent,
    PrecipitationForecastComponent,
  ],
  selector: 'app-weather-widget',
  template: `
    <mat-card class="p-4 m-4 max-w-2xl" appearance="outlined">
      <mat-card-header class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <app-municipality-autocomplete
          class="flex-1 min-w-0"
          (municipalitySelected)="onMunicipalitySelected($event)"
          (municipalityError)="onMunicipalityError($event)"
        ></app-municipality-autocomplete>
        <app-temperature-select
          class="w-full sm:w-auto"
          (unitChanged)="onUnitChanged($event)"
        ></app-temperature-select>
      </mat-card-header>

      <mat-card-content class="flex flex-col items-center">
        @if (!error()) {
          <app-weather-info
            [municipalityName]="selectedMunicipalityName()"
            [temperature]="pronostico()?.mediaTemperatura ?? null"
            [unit]="pronostico()?.unidadTemperatura ?? ''"
          ></app-weather-info>

          <app-precipitation-forecast
            [intervals]="precipitationIntervals()"
          ></app-precipitation-forecast>
        }

        @if (error(); as err) {
          <div class="mt-4 text-red-600 text-center">
            <p>{{ err }}</p>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class WeatherWidget {
  private weatherService = inject(WeatherService);

  protected readonly selectedMunicipality = signal<Municipality | null>(null);
  protected readonly selectedMunicipalityName = signal<string | null>(null);
  protected readonly selectedUnit = signal<TemperatureUnit>('');
  protected readonly pronostico = signal<Prediction | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly precipitationIntervals = computed((): PrecipitationProbability[] => {
    return this.pronostico()?.probPrecipitacion ?? [];
  });

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

  onUnitChanged(unit: TemperatureUnit): void {
    this.selectedUnit.set(unit);
    this.error.set(null);
  }

  private fetchForecast(codigo: string, unidad?: TemperatureUnit): void {
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.obtenerPronostico(codigo, unidad).subscribe({
      next: (pronostico) => {
        this.loading.set(false);
        this.pronostico.set(pronostico);
      },
      error: (err: ApiError) => {
        this.loading.set(false);
        this.error.set(
          err?.message ?? 'Error al cargar la previsión. Por favor, inténtelo de nuevo.',
        );
      },
    });
  }

  onMunicipalityError(message: string): void {
    this.error.set(message);
  }
}
