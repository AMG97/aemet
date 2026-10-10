import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MunicipalityAutocomplete } from './municipality-autocomplete';

describe('MunicipalityAutocomplete', () => {
  let component: MunicipalityAutocomplete;
  let fixture: ComponentFixture<MunicipalityAutocomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunicipalityAutocomplete],
    }).compileComponents();

    fixture = TestBed.createComponent(MunicipalityAutocomplete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
