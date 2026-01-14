/**
 * Types
 * =====
 * 
 * Tipi condivisi per l'applicazione API Bridge
 */

/**
 * Dati meteo normalizzati
 */
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

/**
 * Velocità di animazione
 */
export type AnimationSpeed = "slow" | "normal" | "fast";
