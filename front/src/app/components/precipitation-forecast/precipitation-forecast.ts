import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProbPrecipitacion } from '../../models/precipitation.model';

@Component({
  imports: [CommonModule],
  selector: 'app-precipitation-forecast',
  template: `
    @if (intervals().length > 0) {
      <div class="w-full mt-6">
        <img 
          src="/images/rainy.svg" 
          alt="Probabilidad de precipitación" 
          class="w-10 h-10 mx-auto mb-4 opacity-70"
        />

        <div class="grid grid-cols-4 gap-2">
          @for (interval of intervals(); track interval.periodo; let i = $index) {
            <div class="flex flex-col items-center gap-2">
              <span class="font-medium text-lg">{{ interval.probabilidad }}%</span>

              <div class="h-0.5 w-full bg-gray-400"></div>

              <div class="relative w-full text-center text-sm text-gray-500">
                @if (i === 0) {
                  <span class="absolute left-0 top-0 h-4 border-l border-gray-400"></span>
                }

                <span>{{ interval.periodo }}</span>

                <span class="absolute right-0 top-0 h-4 border-r border-gray-400"></span>
              </div>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="text-center text-gray-500 py-4">
        <p>No hay datos de precipitación disponibles</p>
      </div>
    }
  `,
  styles: ``,
})
export class PrecipitationForecastComponent {
  intervals = input<ProbPrecipitacion[]>([]);
}