import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherInfoComponent } from './weather-info';

describe('WeatherInfoComponent', () => {
  let component: WeatherInfoComponent;
  let fixture: ComponentFixture<WeatherInfoComponent>;

  const getText = (): string => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should display the placeholder when no municipality is selected', () => {
      expect(getText()).toContain('Selecciona un municipio para ver la previsión');
    });

    it('should not display weather information initially', () => {
      const element = fixture.nativeElement as HTMLElement;

      expect(element.querySelector('h2')).toBeNull();
      expect(element.querySelector('img')).toBeNull();
    });
  });

  describe('unit symbol', () => {
    it('should display °C for G_CEL', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.componentRef.setInput('unit', 'G_CEL');
      fixture.detectChanges();

      expect(getText()).toContain('°C');
    });

    it('should display °F for G_FAH', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.componentRef.setInput('unit', 'G_FAH');
      fixture.detectChanges();

      expect(getText()).toContain('°F');
    });

    it('should default to °C when the unit is empty', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.componentRef.setInput('unit', '');
      fixture.detectChanges();

      expect(getText()).toContain('°C');
    });
  });

  describe('template rendering', () => {
    it('should display the municipality name', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.detectChanges();

      expect(getText()).toContain('Madrid');
    });

    it('should display the temperature in Celsius', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.componentRef.setInput('temperature', 22);
      fixture.componentRef.setInput('unit', 'G_CEL');
      fixture.detectChanges();

      expect(getText()).toContain('22');
      expect(getText()).toContain('°C');
    });

    it('should display the temperature in Fahrenheit', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.componentRef.setInput('temperature', 72);
      fixture.componentRef.setInput('unit', 'G_FAH');
      fixture.detectChanges();

      expect(getText()).toContain('72');
      expect(getText()).toContain('°F');
    });

    it('should display the forecast date formatted in Spanish', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.detectChanges();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const expectedDate = tomorrow.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      expect(getText()).toContain(expectedDate);
    });

    it('should render the weather icon with the correct attributes', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;
      const img = element.querySelector('img');

      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('/images/partly_cloudy.svg');
      expect(img?.getAttribute('alt')).toBe('Parcialmente nublado');
    });

    it('should display the placeholder again when municipality name is null', () => {
      fixture.componentRef.setInput('municipalityName', 'Madrid');
      fixture.detectChanges();

      fixture.componentRef.setInput('municipalityName', null);
      fixture.detectChanges();

      expect(getText()).toContain('Selecciona un municipio para ver la previsión');

      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('h2')).toBeNull();
    });
  });
});
