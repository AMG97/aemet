import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Municipality } from '../../models/Municipality';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  selector: 'app-location-autocomplete',
  styles: ``,
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Municipio</mat-label>

      <input
        matInput
        [formControl]="municipalityControl"
        [matAutocomplete]="auto"
        placeholder="Escribe un municipio..."
      />

      <mat-autocomplete #auto="matAutocomplete">
        @for (municipality of municipalities(); track municipality.codigo) {
          <mat-option [value]="municipality.nombre">
            {{ municipality.nombre }}
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class LocationAutocomplete {
  readonly municipalityControl = new FormControl('');

  private readonly municipalityData: Municipality[] = [
    { codigo: '1', nombre: 'Madrid' },
    { codigo: '2', nombre: 'Barcelona' },
  ];

  readonly municipalities = toSignal(
    this.municipalityControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => of(this.municipalityData)),
    ),
    { initialValue: this.municipalityData },
  );
}
