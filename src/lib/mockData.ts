/**
 * Mock Data
 * =========
 * 
 * Dati di esempio per la demo (simulazione API response)
 */

import { WeatherData } from "./types";

export const mockWeatherData: Record<string, WeatherData> = {
  roma: {
    city: "Roma",
    country: "IT",
    temperature: 22,
    description: "Cielo sereno",
    humidity: 45,
    windSpeed: 12,
    icon: "☀️",
  },
  milano: {
    city: "Milano",
    country: "IT",
    temperature: 18,
    description: "Nuvoloso",
    humidity: 65,
    windSpeed: 8,
    icon: "☁️",
  },
  napoli: {
    city: "Napoli",
    country: "IT",
    temperature: 25,
    description: "Soleggiato",
    humidity: 55,
    windSpeed: 15,
    icon: "🌤️",
  },
  londra: {
    city: "Londra",
    country: "UK",
    temperature: 14,
    description: "Pioggia leggera",
    humidity: 80,
    windSpeed: 20,
    icon: "🌧️",
  },
  new_york: {
    city: "New York",
    country: "US",
    temperature: 20,
    description: "Parzialmente nuvoloso",
    humidity: 50,
    windSpeed: 18,
    icon: "⛅",
  },
  parigi: {
    city: "Parigi",
    country: "FR",
    temperature: 16,
    description: "Nuvoloso",
    humidity: 70,
    windSpeed: 10,
    icon: "☁️",
  },
  tokyo: {
    city: "Tokyo",
    country: "JP",
    temperature: 28,
    description: "Umido e caldo",
    humidity: 85,
    windSpeed: 5,
    icon: "🌡️",
  },
};

/**
 * Normalizza i dati meteo
 */
export const normalizeWeatherData = (rawData: WeatherData): WeatherData => {
  return {
    ...rawData,
    temperature: Math.round(rawData.temperature),
  };
};

/**
 * Normalizza il nome della città per la ricerca
 */
export const normalizeCityName = (city: string): string => {
  return city.toLowerCase().replace(/\s+/g, "_");
};

/**
 * Ottiene i dati meteo per una città
 */
export const getWeatherData = (city: string): WeatherData | null => {
  const normalized = normalizeCityName(city);
  return mockWeatherData[normalized] || null;
};
