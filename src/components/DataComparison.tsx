/**
 * DataComparison Component
 * ========================
 * 
 * Componente didattico che mostra il confronto side-by-side
 * tra dati raw dall'API e dati normalizzati per la UI.
 */

import { motion } from "framer-motion";
import { ArrowRight, Thermometer, Wind, Droplets, Sparkles, CheckCircle } from "lucide-react";
import { WeatherData } from "@/lib/types";
import { getWeatherData, normalizeCityName } from "@/lib/mockData";

interface DataComparisonProps {
  city: string;
  normalizedData: WeatherData | null;
}

/**
 * Genera dati raw simulati basati sulla città
 */
const generateRawData = (city: string) => {
  const normalized = normalizeCityName(city);
  const data = getWeatherData(city);
  
  if (!data) return null;

  // Simula la struttura raw che arriverebbe da un'API reale
  return {
    name: data.city,
    sys: { country: data.country },
    main: {
      temp: Math.round(data.temperature + 273.15 * 10) / 10, // Converti a Kelvin
      humidity: data.humidity,
      feels_like: Math.round((data.temperature + 2) + 273.15 * 10) / 10,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: data.description.toLowerCase(),
        icon: "01d",
      },
    ],
    wind: {
      speed: Math.round((data.windSpeed / 3.6) * 10) / 10, // Converti a m/s
      deg: 180,
    },
    coord: {
      lat: 41.9028,
      lon: 12.4964,
    },
  };
};

interface Transformation {
  field: string;
  rawValue: string;
  normalizedValue: string;
  explanation: string;
  icon: React.ReactNode;
}

export const DataComparison = ({ city, normalizedData }: DataComparisonProps) => {
  const rawData = generateRawData(city);

  if (!rawData || !normalizedData) return null;

  const transformations: Transformation[] = [
    {
      field: "Temperatura",
      rawValue: `${rawData.main.temp} K`,
      normalizedValue: `${normalizedData.temperature} °C`,
      explanation: "Conversione da Kelvin a Celsius: K - 273.15 = °C",
      icon: <Thermometer className="w-4 h-4" />,
    },
    {
      field: "Velocità Vento",
      rawValue: `${rawData.wind.speed} m/s`,
      normalizedValue: `${normalizedData.windSpeed} km/h`,
      explanation: "Conversione da metri/secondo a km/h: m/s × 3.6 = km/h",
      icon: <Wind className="w-4 h-4" />,
    },
    {
      field: "Umidità",
      rawValue: `${rawData.main.humidity}%`,
      normalizedValue: `${normalizedData.humidity}%`,
      explanation: "Valore già in percentuale, mantenuto invariato",
      icon: <Droplets className="w-4 h-4" />,
    },
    {
      field: "Struttura",
      rawValue: "Complessa (nested)",
      normalizedValue: "Semplificata (flat)",
      explanation: "Struttura annidata semplificata per facilità d'uso",
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Confronto Dati: Raw vs Normalizzati
        </h3>
        <p className="text-sm text-muted-foreground">
          Vedi come i dati vengono trasformati per essere più facili da usare
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Raw Data */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <h4 className="font-semibold text-foreground">Dati Raw (API)</h4>
          </div>
          <div className="bg-background/50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            <pre className="text-muted-foreground">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>⚠️ Struttura complessa</p>
            <p>⚠️ Unità non standard (Kelvin, m/s)</p>
            <p>⚠️ Dati annidati difficili da usare</p>
          </div>
        </motion.div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <ArrowRight className="w-6 h-6 text-primary" />
          </motion.div>
        </div>

        {/* Normalized Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-success/10 border-2 border-success/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-success" />
            <h4 className="font-semibold text-foreground">Dati Normalizzati (UI)</h4>
          </div>
          <div className="bg-background/50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            <pre className="text-foreground">
              {JSON.stringify(normalizedData, null, 2)}
            </pre>
          </div>
          <div className="mt-3 text-xs text-success">
            <p>✅ Struttura semplice e piatta</p>
            <p>✅ Unità standard (Celsius, km/h)</p>
            <p>✅ Facile da usare nel frontend</p>
          </div>
        </motion.div>
      </div>

      {/* Transformations List */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Trasformazioni Applicate:
        </h4>
        <div className="grid gap-3">
          {transformations.map((transformation, index) => (
            <motion.div
              key={transformation.field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                {transformation.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {transformation.field}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {transformation.rawValue}
                  </span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-success font-medium">
                    {transformation.normalizedValue}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {transformation.explanation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Educational Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-primary/5 border border-primary/20 rounded-lg p-4"
      >
        <p className="text-sm text-foreground">
          <strong className="text-primary">💡 Perché normalizzare?</strong>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          La normalizzazione rende i dati più facili da usare nel frontend, converte le unità
          in formati familiari (Celsius invece di Kelvin) e semplifica la struttura per evitare
          accessi annidati complessi come <code className="text-primary">data.main.temp</code>.
        </p>
      </motion.div>
    </div>
  );
};
