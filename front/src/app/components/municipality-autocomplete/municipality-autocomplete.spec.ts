import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { vi, type Mocked } from 'vitest';
import { of, throwError } from 'rxjs';

import { MunicipalityAutocomplete } from './municipality-autocomplete';
import { WeatherService } from '../../services/weather.service';
import { Municipality } from '../../models/municipality';
import { ApiError } from '../../models/api-error';

describe('MunicipalityAutocomplete', () => {
  let fixture: ComponentFixture<MunicipalityAutocomplete>;
  let component: MunicipalityAutocomplete;
  let weatherServiceMock: Mocked<WeatherService>;

  const mockMunicipalities: Municipality[] = [
    { codigo: '28079', nombre: 'Madrid' },
    { codigo: '08019', nombre: 'Barcelona' },
    { codigo: '41091', nombre: 'Sevilla' },
  ];

  beforeEach(async () => {
    weatherServiceMock = {
      searchMunicipalitiesByPrefix: vi.fn().mockReturnValue(of([])),
    } as unknown as Mocked<WeatherService>;

    await TestBed.configureTestingModule({
      imports: [MunicipalityAutocomplete],
      providers: [{ provide: WeatherService, useValue: weatherServiceMock }],
    }).compileComponents();

    vi.useFakeTimers();

    fixture = TestBed.createComponent(MunicipalityAutocomplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.querySelectorAll('.cdk-overlay-container').forEach((overlay) => overlay.remove());
  });

  async function advanceDebounce(): Promise<void> {
    await vi.advanceTimersByTimeAsync(400);
    fixture.detectChanges();
  }

  describe('initial state', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with an empty municipalities list', () => {
      expect(component.municipalities()).toEqual([]);
    });
  });

  describe('municipality search', () => {
    it('should return municipalities when the search succeeds', async () => {
      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(of(mockMunicipalities));

      component.municipalityControl.setValue('Mad');
      await advanceDebounce();

      expect(weatherServiceMock.searchMunicipalitiesByPrefix).toHaveBeenCalledWith('Mad');

      expect(component.municipalities()).toEqual(mockMunicipalities);
    });

    it('should return an empty list when no municipalities are found', async () => {
      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(of([]));

      component.municipalityControl.setValue('NonExistent');
      await advanceDebounce();

      expect(component.municipalities()).toEqual([]);
    });

    it('should debounce the search by 400 milliseconds', async () => {
      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(of(mockMunicipalities));

      component.municipalityControl.setValue('M');

      await vi.advanceTimersByTimeAsync(200);

      expect(weatherServiceMock.searchMunicipalitiesByPrefix).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(200);
      fixture.detectChanges();

      expect(weatherServiceMock.searchMunicipalitiesByPrefix).toHaveBeenCalledWith('M');
    });

    it('should search using the empty prefix after the initial debounce', async () => {
      // The current implementation starts with '' and sends it to
      // the service after 400 ms because there is no empty-string guard.
      await advanceDebounce();

      expect(weatherServiceMock.searchMunicipalitiesByPrefix).toHaveBeenCalledWith('');
    });

    it('should emit the API error message when a search fails', async () => {
      const apiError: ApiError = {
        status: 500,
        message: 'Error de servidor',
        timestamp: new Date().toISOString(),
      };

      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(throwError(() => apiError));

      let emittedError: string | undefined;
      component.municipalityError.subscribe((message) => {
        emittedError = message;
      });

      component.municipalityControl.setValue('Madrid');
      await advanceDebounce();

      expect(emittedError).toBe('Error de servidor');
      expect(component.municipalities()).toEqual([]);
    });

    it('should use a fallback message when the search error has no message', async () => {
      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(
        throwError(() => ({
          status: 500,
          timestamp: new Date().toISOString(),
        })),
      );

      let emittedError: string | undefined;
      component.municipalityError.subscribe((message) => {
        emittedError = message;
      });

      component.municipalityControl.setValue('Madrid');
      await advanceDebounce();

      expect(emittedError).toBe('Error al buscar municipios');
    });

    it('should not search again when the search value has not changed', async () => {
      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(of([]));

      component.municipalityControl.setValue('Madrid');
      await advanceDebounce();

      expect(weatherServiceMock.searchMunicipalitiesByPrefix).toHaveBeenCalledTimes(1);

      component.municipalityControl.setValue('Madrid');
      await advanceDebounce();

      expect(weatherServiceMock.searchMunicipalitiesByPrefix).toHaveBeenCalledTimes(1);
    });
  });

  describe('displayMunicipality', () => {
    it('should display a municipality name', () => {
      expect(component.displayMunicipality(mockMunicipalities[0])).toBe('Madrid');
    });

    it('should return a string unchanged', () => {
      expect(component.displayMunicipality('Madrid')).toBe('Madrid');
    });

    it('should return an empty string for null', () => {
      expect(component.displayMunicipality(null as unknown as Municipality | string)).toBe('');
    });
  });

  describe('municipality selection', () => {
    it('should emit the selected municipality when an option is selected', async () => {
      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(of(mockMunicipalities));

      let selectedMunicipality: Municipality | undefined;
      component.municipalitySelected.subscribe((municipality) => {
        selectedMunicipality = municipality;
      });

      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

      input.focus();
      component.municipalityControl.setValue('Mad');
      await advanceDebounce();

      const trigger = fixture.debugElement
        .query(By.directive(MatAutocompleteTrigger))
        .injector.get(MatAutocompleteTrigger);

      trigger.openPanel();
      fixture.detectChanges();

      const options = document.body.querySelectorAll('mat-option');
      const madridOption = Array.from(options).find((option) =>
        option.textContent?.includes('Madrid'),
      );

      expect(madridOption).toBeTruthy();

      madridOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(selectedMunicipality).toEqual(mockMunicipalities[0]);
    });
  });

  describe('template rendering', () => {
    it('should render the form field', () => {
      expect(fixture.nativeElement.querySelector('mat-form-field')).toBeTruthy();
    });

    it('should render the input with the correct placeholder', () => {
      const input = fixture.nativeElement.querySelector('input[matInput]') as HTMLInputElement;

      expect(input).toBeTruthy();
      expect(input.placeholder).toBe('Escribe un municipio...');
    });

    it('should render the autocomplete component', () => {
      expect(fixture.nativeElement.querySelector('mat-autocomplete')).toBeTruthy();
    });

    it('should display municipality options returned by the service', async () => {
      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(of(mockMunicipalities));

      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

      input.focus();
      component.municipalityControl.setValue('Mad');
      await advanceDebounce();

      const trigger = fixture.debugElement
        .query(By.directive(MatAutocompleteTrigger))
        .injector.get(MatAutocompleteTrigger);

      trigger.openPanel();
      fixture.detectChanges();

      const options = document.body.querySelectorAll('mat-option');

      expect(options).toHaveLength(3);
      expect(options[0].textContent).toContain('Madrid');
      expect(options[1].textContent).toContain('Barcelona');
      expect(options[2].textContent).toContain('Sevilla');
    });

    it('should display the empty message when no municipalities are found', async () => {
      weatherServiceMock.searchMunicipalitiesByPrefix.mockReturnValue(of([]));

      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

      input.focus();
      component.municipalityControl.setValue('NonExistent');
      await advanceDebounce();

      const trigger = fixture.debugElement
        .query(By.directive(MatAutocompleteTrigger))
        .injector.get(MatAutocompleteTrigger);

      trigger.openPanel();
      fixture.detectChanges();

      const emptyOption = document.body.querySelector('mat-option[aria-disabled="true"]');

      expect(emptyOption).toBeTruthy();
      expect(emptyOption?.textContent).toContain('No se encontraron municipios');
    });
  });
});
