import { Component, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TemperatureUnit } from '../../models/temperature-unit';

@Component({
  imports: [MatSelectModule, MatFormFieldModule, FormsModule],
  selector: 'app-temperature-select',
  template: `
    <mat-form-field class="w-40 text-sm" appearance="outline">
      <mat-label>Unidad</mat-label>
      <mat-select [(ngModel)]="selectedUnit" (selectionChange)="onUnitChange()">
        @for (option of temperatureOptions; track option.value) {
          <mat-option [value]="option.value">{{ option.viewValue }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: ``,
})
export class TemperatureSelect {
  unitChanged = output<TemperatureUnit>();

  selectedUnit: TemperatureUnit = '';

  temperatureOptions: { value: TemperatureUnit; viewValue: string }[] = [
    { value: 'G_CEL', viewValue: '°C' },
    { value: 'G_FAH', viewValue: '°F' },
  ];

  onUnitChange(): void {
    this.unitChanged.emit(this.selectedUnit);
  }
}
