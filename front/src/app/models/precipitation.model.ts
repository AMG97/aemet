export interface ProbPrecipitacion {
  probabilidad: number;
  periodo: string;
}

export interface Pronostico {
  mediaTemperatura: number;
  unidadTemperatura: string;
  probPrecipitacion: ProbPrecipitacion[];
}