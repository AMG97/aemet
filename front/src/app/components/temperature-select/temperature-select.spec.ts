import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemperatureSelect } from './temperature-select';
import { TemperatureUnit } from '../../models/temperature-unit';

describe('TemperatureSelect', () => {
  let component: TemperatureSelect;
  let fixture: ComponentFixture<TemperatureSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemperatureSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(TemperatureSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty selected unit initially', () => {
      expect(component.selectedUnit).toBe('');
    });

    it('should have temperature options defined', () => {
      expect(component.temperatureOptions).toEqual([
        { value: 'G_CEL', viewValue: '°C' },
        { value: 'G_FAH', viewValue: '°F' },
      ]);
    });
  });

  describe('onUnitChange', () => {
    it('should emit unitChanged with selected unit', () => {
      let emittedUnit: TemperatureUnit | null = null;
      component.unitChanged.subscribe((unit) => (emittedUnit = unit));

      component.selectedUnit = 'G_CEL';
      component.onUnitChange();

      expect(emittedUnit).toBe('G_CEL');
    });

    it('should emit unitChanged with Fahrenheit unit', () => {
      let emittedUnit: TemperatureUnit | null = null;
      component.unitChanged.subscribe((unit) => (emittedUnit = unit));

      component.selectedUnit = 'G_FAH';
      component.onUnitChange();

      expect(emittedUnit).toBe('G_FAH');
    });

    it('should emit empty string when no unit selected', () => {
      let emittedUnit: TemperatureUnit | null = null;
      component.unitChanged.subscribe((unit) => (emittedUnit = unit));

      component.selectedUnit = '';
      component.onUnitChange();

      expect(emittedUnit).toBe('');
    });
  });

  describe('template rendering', () => {
    it('should render mat-form-field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-form-field')).toBeTruthy();
    });

    it('should render mat-select', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-select')).toBeTruthy();
    });

    it('should bind selectedUnit to mat-select', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('mat-select') as HTMLSelectElement;
      expect(select).toBeTruthy();
    });
  });
});
