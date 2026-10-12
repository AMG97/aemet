# Aplicación Meteorológica AEMET

Aplicación full-stack para consultar previsiones meteorológicas en cualquier municipio de España usando la API OpenData de AEMET.

## Arquitectura

- **Backend**: Spring Boot 4.1.1 + Java 17
- **Frontend**: Angular 22 + Angular Material + TailwindCSS
- **Testing**: JUnit 5 + Mockito + JaCoCo (Backend) | Vitest (Frontend)
- **CI/CD**: GitHub Actions

## Prerrequisitos

- Java 17+
- Maven 3.9+ (o usar el `mvnw` incluido)
- Node.js 22
- npm 10+
- API Key de AEMET (gratuita en [AEMET OpenData](https://opendata.aemet.es/centrodedescargas/inicio))

## Configuración

### Backend

La configuración en `src/main/resources/application.yaml` usa una variable de entorno para la API Key que tendrás que definir con tu propia KEY:

```yaml
aemet:
  api-key: ${AEMET_API_KEY}
  base-url: https://opendata.aemet.es/opendata
```

### Frontend

El frontend usa archivos de entorno de Angular (`src/environments/environment*.ts`) para la URL del backend. **Estos archivos no se suben al repositorio** (están en `.gitignore`).

Crea `src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: "http://localhost:8080", //o el puerto en el que esté el back
};
```

## Ejecución Local

**Terminal 1 - Backend:**

```bash
cd back
./mvnw spring-boot:run
```

Backend disponible en `http://localhost:8080`

**Terminal 2 - Frontend:**

```bash
cd front
npm install
npm start
```

Frontend disponible en `http://localhost:4200`

## Ejecución de Tests

### Tests Backend (con cobertura JaCoCo)

```bash
cd back
./mvnw verify
```

Esto ejecuta tests + comprobación de cobertura (JaCoCo). Informe: `back/target/site/jacoco/index.html`

### Tests Frontend (con cobertura Vitest)

```bash
cd front
npm install
ng test --coverage --watch=false
```

Informe de cobertura: `front/coverage/index.html`

## GitHub Actions CI/CD

El pipeline (`.github/workflows/ci.yml`) se ejecuta en cada push a `main`:

**Jobs en paralelo:**

- **backend-test**: Compila, testea y verifica cobertura JaCoCo (≥90% líneas, ≥80% ramas)
- **frontend-test**: Instala dependencias, testea y verifica cobertura Vitest (≥80% statements, ≥70% branches, ≥70% functions, ≥80% lines)

**Notificación:**

- **notify**: Solo si falla alguno de los dos jobs anteriores

- 📦 Artifacts subidos: Reportes de test (JUnit XML) y cobertura (HTML) de ambos lados (retención 7 días)

## Estructura del Proyecto

```
aemet/
├── back/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/java/com/agap2/aemet/
│   │   │   ├── application/     # Casos de uso
│   │   │   ├── domain/          # Modelos de dominio y repositorios
│   │   │   ├── infrastructure/  # Adaptadores externos (cliente AEMET, repos)
│   │   │   └── presentation/    # Controladores, DTOs, mappers
│   │   └── test/                # Tests unitarios e integración
│   └── pom.xml
├── front/                   # Angular Frontend
│   ├── src/app/
│   │   ├── components/      # Componentes UI
│   │   ├── services/        # Servicios HTTP
│   │   ├── models/          # Interfaces TypeScript
│   │   └── interceptors/    # Interceptores HTTP
│   └── package.json
├── .github/workflows/       # Pipeline CI/CD
├── INTERVIEW_ANSWERS.md     # Respuestas a preguntas técnicas
└── README.md               # Este archivo
```

## Endpoints API

| Método | Endpoint                                                                  | Descripción                      |
| ------ | ------------------------------------------------------------------------- | -------------------------------- |
| GET    | `/api/v1/municipalities/search?prefix={prefijo}`                          | Buscar municipios por prefijo    |
| GET    | `/api/v1/forecast/next-day?municipalityCode={codigo}&unit={G_CEL\|G_FAH}` | Obtener predicción día siguiente |

## Preguntas de la Entrevista

Ver [INTERVIEW_ANSWERS.md](INTERVIEW_ANSWERS.md) para las respuestas a las cuestiones técnicas.
