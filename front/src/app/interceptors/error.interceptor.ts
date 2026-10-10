import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../models/api-error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError: ApiError = {
          status: error.status,
          message: this.getErrorMessage(error),
          timestamp: new Date().toISOString(),
        };

        console.error('API Error:', apiError);
        return throwError(() => apiError);
      }),
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.descripcion) {
      return error.error.descripcion;
    }
    switch (error.status) {
      case 0:
        return 'No se puede conectar con el servidor. Verifique su conexión.';
      case 400:
        return 'Solicitud inválida.';
      case 404:
        return 'Recurso no encontrado.';
      case 429:
        return 'Demasiadas solicitudes. Inténtelo de nuevo en un minuto.';
      case 500:
        return 'Error interno del servidor.';
      case 502:
        return 'Error del servicio meteorológico. Inténtelo más tarde.';
      case 503:
        return 'Servicio no disponible temporalmente.';
      default:
        return `Error ${error.status}: ${error.statusText}`;
    }
  }
}
