import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ErrorMessage } from './error-message';

describe('ErrorMessage', () => {
  let fixture: ComponentFixture<ErrorMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessage],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessage);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have null message initially', () => {
      expect(fixture.componentInstance.message()).toBeNull();
    });
  });

  describe('template rendering', () => {
    it('should not render the error message when message is null', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('[role="alert"]')).toBeNull();
    });

    it('should not render the error message when message is an empty string', () => {
      fixture.componentRef.setInput('message', '');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('[role="alert"]')).toBeNull();
    });

    it('should render the error message when a message is provided', () => {
      fixture.componentRef.setInput('message', 'Error de prueba');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('[role="alert"]');

      expect(errorMessage).not.toBeNull();
      expect(errorMessage?.textContent).toContain('Error de prueba');
    });

    it('should render the error icon', () => {
      fixture.componentRef.setInput('message', 'Error de prueba');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const icon = compiled.querySelector('mat-icon');

      expect(icon).not.toBeNull();
      expect(icon?.textContent?.trim()).toBe('error');
    });

    it('should have role alert', () => {
      fixture.componentRef.setInput('message', 'Error de prueba');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('[role="alert"]')).not.toBeNull();
    });

    it('should have the correct styling classes', () => {
      fixture.componentRef.setInput('message', 'Error de prueba');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('[role="alert"]');

      expect(errorMessage).not.toBeNull();
      expect(errorMessage?.classList.contains('bg-red-50')).toBe(true);
      expect(errorMessage?.classList.contains('border-red-200')).toBe(true);
      expect(errorMessage?.classList.contains('rounded-lg')).toBe(true);
      expect(errorMessage?.classList.contains('text-red-700')).toBe(true);
      expect(errorMessage?.classList.contains('text-center')).toBe(true);
    });

    it('should update the displayed message when the input changes', () => {
      fixture.componentRef.setInput('message', 'First error');
      fixture.detectChanges();

      fixture.componentRef.setInput('message', 'Updated error');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('[role="alert"]');

      expect(errorMessage?.textContent).toContain('Updated error');
      expect(errorMessage?.textContent).not.toContain('First error');
    });

    it('should hide the error message when the input changes back to null', () => {
      fixture.componentRef.setInput('message', 'Error de prueba');
      fixture.detectChanges();

      fixture.componentRef.setInput('message', null);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('[role="alert"]')).toBeNull();
    });
  });
});
