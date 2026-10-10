export interface PrecipitationProbability {
  probabilidad: number;
  periodo: string;
}

export interface Prediction {
  mediaTemperatura: number;
  unidadTemperatura: string;
  probPrecipitacion: PrecipitationProbability[];
}
