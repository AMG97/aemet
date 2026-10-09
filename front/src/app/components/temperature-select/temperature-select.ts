import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  imports: [MatSelectModule, MatFormFieldModule],
  selector: 'app-temperature-select',
  styles: ``,
  template: `
    <mat-form-field>
      <mat-label>Temperature</mat-label>
      <mat-select>
        @for (option of temperatureOptions; track option) {
          <mat-option [value]="option.value">{{ option.viewValue }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class TemperatureSelect {
  temperatureOptions: { value: string; viewValue: string }[] = [
    { value: 'G_CEL', viewValue: 'ºC' },
    { value: 'G_FAH', viewValue: 'ºF' },
  ];
}
