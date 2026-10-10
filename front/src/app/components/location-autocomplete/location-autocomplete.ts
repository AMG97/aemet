import { Component, output, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of, startWith, map } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Municipality } from '../../models/municipality';
import { WeatherService } from '../../services/weather.service';

@Component({
  imports: [MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  selector: 'app-location-autocomplete',
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Municipio</mat-label>

      <input
        matInput
        [formControl]="municipalityControl"
        [matAutocomplete]="auto"
        placeholder="Escribe un municipio..."
      />

      <mat-autocomplete
        #auto="matAutocomplete"
        [displayWith]="displayMunicipality"
        (optionSelected)="onOptionSelected($event)"
      >
        @for (municipality of municipalities(); track municipality.codigo) {
          <mat-option [value]="municipality">
            {{ municipality.nombre }}
          </mat-option>
        } @empty {
          <mat-option disabled>
            <span class="text-gray-500">No se encontraron municipios</span>
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: ``,
})
export class LocationAutocomplete {
  private weatherService = inject(WeatherService);

  municipalitySelected = output<Municipality>();

  readonly municipalityControl = new FormControl<Municipality | string>('');

  readonly municipalities = toSignal(
    this.municipalityControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged((a, b) => this.getSearchValue(a) === this.getSearchValue(b)),
      switchMap((value) => {
        const searchText = this.getSearchValue(value);
        return searchText.length >= 2 ? this.weatherService.buscarMunicipios(searchText) : of([]);
      }),
    ),
    { initialValue: [] as Municipality[] },
  );

  displayMunicipality = (municipality: Municipality | string): string => {
    return typeof municipality === 'string' ? municipality : (municipality?.nombre ?? '');
  };

  private getSearchValue(value: Municipality | string | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : (value.nombre ?? '');
  }

  // Called when user selects an option from autocomplete
  protected onOptionSelected(event: any): void {
    const municipio = event.option.value as Municipality;
    if (municipio) {
      this.municipalitySelected.emit(municipio);
      // The form control will now hold the municipality object, displayWith shows the name
    }
  }
}
