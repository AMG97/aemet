import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { WeatherService } from './services/weather.service';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  const weatherServiceMock = {
    searchMunicipalitiesByPrefix: vi.fn(),
    getForecastNextDay: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: WeatherService,
          useValue: weatherServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the weather widget', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-weather-widget')).not.toBeNull();
  });
});
