import { Component, signal } from '@angular/core';
import { WeatherWidget } from './components/weather-widget/weather-widget';

@Component({
  imports: [WeatherWidget],
  selector: 'app-root',
  styles: [],
  template: `
    <app-weather-widget></app-weather-widget>
  `,
})
export class App {
}
