import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrecipitationForecastComponent } from './precipitation-forecast';
import { PrecipitationProbability } from '../../models/prediction';

describe('PrecipitationForecastComponent', () => {
  let fixture: ComponentFixture<PrecipitationForecastComponent>;

  const mockIntervals: PrecipitationProbability[] = [
    { probabilidad: 10, periodo: '00-06' },
    { probabilidad: 20, periodo: '06-12' },
    { probabilidad: 30, periodo: '12-18' },
    { probabilidad: 40, periodo: '18-24' },
  ];

  const getElement = (): HTMLElement => fixture.nativeElement as HTMLElement;

  const getText = (): string => getElement().textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecipitationForecastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrecipitationForecastComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('initial state', () => {
    it('should display the empty state when no intervals are provided', () => {
      expect(getText()).toContain('No hay datos de precipitación disponibles');
    });

    it('should not render the precipitation grid when intervals are empty', () => {
      expect(getElement().querySelector('.grid')).toBeNull();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('intervals', mockIntervals);
      fixture.detectChanges();
    });

    it('should display all precipitation probabilities', () => {
      const text = getText();

      expect(text).toContain('10%');
      expect(text).toContain('20%');
      expect(text).toContain('30%');
      expect(text).toContain('40%');
    });

    it('should display all period labels', () => {
      const text = getText();

      expect(text).toContain('00-06');
      expect(text).toContain('06-12');
      expect(text).toContain('12-18');
      expect(text).toContain('18-24');
    });

    it('should render the rain icon with the correct attributes', () => {
      const img = getElement().querySelector('img');

      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('/images/rainy.svg');
      expect(img?.getAttribute('alt')).toBe('Probabilidad de precipitación');
    });

    it('should render one horizontal bar per interval', () => {
      const bars = getElement().querySelectorAll('.h-0\\.5');

      expect(bars).toHaveLength(mockIntervals.length);
    });

    it('should render a four-column grid', () => {
      const grid = getElement().querySelector('.grid');

      expect(grid).toBeTruthy();
      expect(grid?.classList.contains('grid-cols-4')).toBe(true);
    });

    it('should render one column item per interval', () => {
      const gridItems = getElement().querySelectorAll('.grid > div');

      expect(gridItems).toHaveLength(mockIntervals.length);
    });

    it('should render the boundary tick at the start and end of the timeline', () => {
      const element = getElement();

      // The first interval has a left boundary tick.
      expect(element.querySelectorAll('.border-l')).toHaveLength(1);

      // Every interval has a right boundary tick.
      expect(element.querySelectorAll('.border-r')).toHaveLength(mockIntervals.length);
    });
  });

  describe('input updates', () => {
    it('should show the empty state when intervals are changed to an empty array', () => {
      fixture.componentRef.setInput('intervals', mockIntervals);
      fixture.detectChanges();

      fixture.componentRef.setInput('intervals', []);
      fixture.detectChanges();

      expect(getText()).toContain('No hay datos de precipitación disponibles');
      expect(getElement().querySelector('.grid')).toBeNull();
    });

    it('should update the displayed data when intervals change', () => {
      fixture.componentRef.setInput('intervals', [{ probabilidad: 55, periodo: '00-06' }]);
      fixture.detectChanges();

      expect(getText()).toContain('55%');
      expect(getText()).toContain('00-06');
      expect(getText()).not.toContain('10%');
    });
  });
});
