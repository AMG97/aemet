import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'app-weather-info',
  template: `
    @if (municipalityName(); as name) {
      <div class="flex items-end justify-center gap-6 w-full">
        <div class="text-center">
          <h2 class="text-2xl font-bold">{{ name }}</h2>
          <p class="text-xl text-gray-600">{{ forecastDate() }}</p>
        </div>

        <div class="flex flex-col items-center justify-center">
          <img 
            [src]="iconUrl()" 
            [alt]="iconAlt()" 
            class="w-24 h-24"
          />
          <p class="font-bold text-3xl mt-2">
            {{ temperature() }}<span class="text-xl">{{ unitSymbol() }}</span>
          </p>
        </div>
      </div>
    } @else {
      <div class="text-center text-gray-500 py-8">
        <p>Selecciona un municipio para ver la previsión</p>
      </div>
    }
  `,
  styles: ``,
})
export class WeatherInfoComponent {
  municipalityName = input<string | null>(null);
  temperature = input<number | null>(null);
  unit = input<'G_CEL' | 'G_FAH' | ''>('');
  icon = input<string>('partly_cloudy');

  protected forecastDate = computed(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  });

  protected unitSymbol = computed(() => {
    return this.unit() === 'G_FAH' ? '°F' : '°C';
  });

  protected iconUrl = computed(() => {
    return `/images/${this.icon()}.svg`;
  });

  protected iconAlt = computed(() => {
    const icons: Record<string, string> = {
      partly_cloudy: 'Parcialmente nublado',
      sunny: 'Soleado',
      cloudy: 'Nublado',
      rainy: 'Lluvioso',
    };
    return icons[this.icon()] || 'Icono meteorológico';
  });
}