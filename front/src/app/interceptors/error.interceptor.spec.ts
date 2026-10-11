import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorInterceptor } from './error.interceptor';
import { ApiError } from '../models/api-error';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  const testUrl = '/api/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  describe('successful requests', () => {
    it('should pass through successful responses', () => {
      let response: unknown;

      httpClient.get(testUrl).subscribe((result) => {
        response = result;
      });

      const req = httpMock.expectOne(testUrl);
      req.flush({ data: 'success' });

      expect(response).toEqual({ data: 'success' });
    });
  });

  describe('error handling', () => {
    const testCases = [
      {
        status: 0,
        expectedMessage: 'No se puede conectar con el servidor. Verifique su conexión.',
      },
      { status: 400, expectedMessage: 'Solicitud inválida.' },
      { status: 404, expectedMessage: 'Recurso no encontrado.' },
      {
        status: 429,
        expectedMessage: 'Demasiadas solicitudes. Inténtelo de nuevo en un minuto.',
      },
      { status: 500, expectedMessage: 'Error interno del servidor.' },
      {
        status: 502,
        expectedMessage: 'Error del servicio meteorológico. Inténtelo más tarde.',
      },
      {
        status: 503,
        expectedMessage: 'Servicio no disponible temporalmente.',
      },
      { status: 504, expectedMessage: 'Error 504: Gateway Timeout' },
    ];

    it.each(testCases)(
      'should convert HTTP $status error to ApiError with the correct message',
      ({ status, expectedMessage }) => {
        let receivedError: ApiError | undefined;

        httpClient.get(testUrl).subscribe({
          error: (error: ApiError) => {
            receivedError = error;
          },
        });

        const req = httpMock.expectOne(testUrl);
        req.flush('Error', {
          status,
          statusText: getStatusText(status),
        });

        expect(receivedError).toBeDefined();
        expect(receivedError?.status).toBe(status);
        expect(receivedError?.message).toBe(expectedMessage);
        expect(receivedError?.timestamp).toBeDefined();
      },
    );

    it('should include a valid ISO timestamp in ApiError', () => {
      let receivedError: ApiError | undefined;

      httpClient.get(testUrl).subscribe({
        error: (error: ApiError) => {
          receivedError = error;
        },
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(receivedError).toBeDefined();
      expect(Number.isNaN(Date.parse(receivedError!.timestamp))).toBe(false);
      expect(new Date(receivedError!.timestamp).toISOString()).toBe(receivedError!.timestamp);
    });

    it('should log the ApiError to the console', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      let receivedError: ApiError | undefined;

      httpClient.get(testUrl).subscribe({
        error: (error: ApiError) => {
          receivedError = error;
        },
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(consoleSpy).toHaveBeenCalledWith('API Error:', receivedError);
    });
  });

  describe('different HTTP methods', () => {
    it('should handle POST errors', () => {
      let receivedError: ApiError | undefined;

      httpClient.post(testUrl, { data: 'test' }).subscribe({
        error: (error: ApiError) => {
          receivedError = error;
        },
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('POST');
      req.flush('Bad Request', {
        status: 400,
        statusText: 'Bad Request',
      });

      expect(receivedError?.status).toBe(400);
    });

    it('should handle PUT errors', () => {
      let receivedError: ApiError | undefined;

      httpClient.put(testUrl, { data: 'test' }).subscribe({
        error: (error: ApiError) => {
          receivedError = error;
        },
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PUT');
      req.flush('Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(receivedError?.status).toBe(500);
    });

    it('should handle DELETE errors', () => {
      let receivedError: ApiError | undefined;

      httpClient.delete(testUrl).subscribe({
        error: (error: ApiError) => {
          receivedError = error;
        },
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });

      expect(receivedError?.status).toBe(404);
    });
  });
});

function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    0: 'Network Error',
    400: 'Bad Request',
    404: 'Not Found',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };

  return statusTexts[status] ?? 'Unknown Error';
}
