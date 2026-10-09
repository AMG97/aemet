import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TemperatureSelect } from '../temperature-select/temperature-select';
import { LocationAutocomplete } from '../location-autocomplete/location-autocomplete';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatCardModule, TemperatureSelect, LocationAutocomplete, MatIconModule],
  selector: 'app-weather-widget',
  styles: ``,
  template: `
    <mat-card class="p-2 m-2 max-w-lg" appearance="outlined">
      <mat-card-header class="flexitems-center">
        <app-location-autocomplete></app-location-autocomplete>
        <app-temperature-select class="ml-auto"></app-temperature-select>
      </mat-card-header>
      <mat-card-content class="flex flex-col items-center justify-center">
        <div class="flex items-center justify-center gap-6">
          <div>
            <h2 class="text-2xl font-bold">Jumilla</h2>
            <p class="text-xl">09/10/2026</p>
          </div>

          <div>
            <mat-icon class="material-symbols-outlined">partly_cloudy_day</mat-icon>
            <p class="text-2xl font-bold">25ºC</p>
          </div>
        </div>

        <div class="grid grid-cols-4 mt-6">
          @for (intervalo of intervalos; track intervalo.horas; let i = $index) {
            <div class="flex flex-col items-center gap-2">
              <span>{{ intervalo.probabilidad }}%</span>

              <div class="h-0.5 w-full bg-gray-400"></div>

              <div class="relative w-full text-center text-sm text-gray-500">
                @if (i === 0) {
                  <span class="absolute left-0 top-0 h-4 border-l border-gray-400"></span>
                }

                <span>{{ intervalo.horas }}</span>

                <span class="absolute right-0 top-0 h-4 border-r border-gray-400"></span>
              </div>
            </div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class WeatherWidget {
  intervalos = [
    { horas: '00-06 h', probabilidad: 10 },
    { horas: '06-12 h', probabilidad: 35 },
    { horas: '12-18 h', probabilidad: 80 },
    { horas: '18-24 h', probabilidad: 20 },
  ];
}
