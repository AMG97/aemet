import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'app-error-message',
  template: `
    @if (message(); as msg) {
      <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center" role="alert">
        <p class="flex items-center justify-center gap-2">
          <mat-icon>error</mat-icon>
          {{ msg }}
        </p>
      </div>
    }
  `,
  styles: ``,
})
export class ErrorMessage {
  message = input<string | null>(null);
}