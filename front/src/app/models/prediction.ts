import { TemperatureUnit } from './temperature-unit';

export interface PrecipitationProbability {
  probabilidad: number;
  periodo: string;
}

export interface Prediction {
  mediaTemperatura: number;
  unidadTemperatura: TemperatureUnit;
  probPrecipitacion: PrecipitationProbability[];
}
