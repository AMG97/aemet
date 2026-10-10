import { Component, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

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
  unitChanged = output<'G_CEL' | 'G_FAH' | ''>();

  selectedUnit: 'G_CEL' | 'G_FAH' | '' = '';

  temperatureOptions: { value: 'G_CEL' | 'G_FAH'; viewValue: string }[] = [
    { value: 'G_CEL', viewValue: '°C' },
    { value: 'G_FAH', viewValue: '°F' },
  ];

  onUnitChange(): void {
    this.unitChanged.emit(this.selectedUnit);
  }
}