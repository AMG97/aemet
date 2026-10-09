import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemperatureSelect } from './temperature-select';

describe('TemperatureSelect', () => {
  let component: TemperatureSelect;
  let fixture: ComponentFixture<TemperatureSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemperatureSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(TemperatureSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
