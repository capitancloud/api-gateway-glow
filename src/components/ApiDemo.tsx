/**
 * ApiDemo Component
 * =================
 * 
 * Componente interattivo per dimostrare come funziona una chiamata API.
 * 
 * NOTA EDUCATIVA:
 * ---------------
 * Questa è una demo che simula una chiamata API. In un'applicazione reale,
 * la chiamata verrebbe effettuata attraverso un backend (edge function)
 * per proteggere le API key e gestire la logica server-side.
 * 
 * Flusso tipico:
 * 1. L'utente inserisce un input (es: città per il meteo)
 * 2. Il frontend invia la richiesta al nostro backend
 * 3. Il backend chiama l'API esterna usando la API key (mai esposta al client!)
 * 4. Il backend normalizza i dati e li restituisce al frontend
 * 5. Il frontend visualizza i dati in modo user-friendly
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, Loader2, Cloud, Thermometer, Wind, Droplets, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "@/components/ui/CodeBlock";

/**
 * Interfaccia per i dati meteo normalizzati
 * 
 * NORMALIZZAZIONE:
 * Quando riceviamo dati da un'API esterna, spesso sono in un formato
 * complesso o non ottimale per la nostra UI. La normalizzazione 
 * trasforma questi dati in una struttura più semplice e consistente.
 */
interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

/**
 * Dati di esempio per la demo (simulazione API response)
 * In produzione, questi dati verrebbero da un'API reale come OpenWeatherMap
 */
const mockWeatherData: Record<string, WeatherData> = {
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
};

/**
 * Funzione per normalizzare la risposta dell'API
 * 
 * In un'applicazione reale, questa funzione trasformerebbe
 * la risposta grezza dell'API in un formato più gestibile.
 * 
 * Esempio di risposta grezza da OpenWeatherMap:
 * {
 *   "main": { "temp": 295.15, "humidity": 45 },
 *   "weather": [{ "description": "clear sky" }],
 *   "wind": { "speed": 3.5 },
 *   "name": "Roma",
 *   "sys": { "country": "IT" }
 * }
 * 
 * Viene trasformata in un oggetto più semplice e con unità convertite
 */
const normalizeWeatherData = (rawData: WeatherData): WeatherData => {
  // In questo esempio i dati sono già "normalizzati"
  // Ma in produzione qui convertiremmo Kelvin → Celsius,
  // tradurremmo le descrizioni, ecc.
  return {
    ...rawData,
    // Esempio: potremmo arrotondare la temperatura
    temperature: Math.round(rawData.temperature),
  };
};

export const ApiDemo = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);

  /**
   * Simula una chiamata API
   * 
   * In produzione, questa funzione chiamerebbe una edge function:
   * const response = await fetch('/api/weather', {
   *   method: 'POST',
   *   body: JSON.stringify({ city: query })
   * });
   */
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Simula latenza di rete
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const normalizedQuery = query.toLowerCase().replace(/\s+/g, "_");
    const data = mockWeatherData[normalizedQuery];

    if (data) {
      // Normalizza i dati prima di mostrarli
      const normalizedData = normalizeWeatherData(data);
      setResult(normalizedData);
    } else {
      setError(`Città "${query}" non trovata. Prova: Roma, Milano, Napoli, Londra, New York`);
    }

    setLoading(false);
  };

  const exampleCode = `// Edge Function (backend) - NON espone l'API key
import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  // La API key è nelle variabili d'ambiente (sicura!)
  const API_KEY = Deno.env.get("WEATHER_API_KEY");
  
  const { city } = await req.json();
  
  // Chiamata all'API esterna
  const response = await fetch(
    \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}\`
  );
  
  const rawData = await response.json();
  
  // Normalizzazione dei dati
  const normalized = {
    city: rawData.name,
    temperature: Math.round(rawData.main.temp - 273.15),
    description: rawData.weather[0].description,
    humidity: rawData.main.humidity,
    windSpeed: rawData.wind.speed
  };
  
  return new Response(JSON.stringify(normalized));
});`;

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Inserisci una città (es: Roma, Milano, Londra...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 h-12 bg-muted border-border focus:border-primary focus:ring-primary"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={loading || !query.trim()}
          className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Results area */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-xl p-8 text-center"
          >
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              Chiamata API in corso...
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              (In produzione: Frontend → Backend → API Esterna)
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass rounded-xl p-6 border-destructive/50"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-destructive font-medium">Errore API</p>
                <p className="text-muted-foreground text-sm mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass rounded-xl overflow-hidden"
          >
            {/* Weather header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {result.city}, {result.country}
                  </h3>
                  <p className="text-muted-foreground">{result.description}</p>
                </div>
                <div className="text-6xl">{result.icon}</div>
              </div>
            </div>

            {/* Weather stats */}
            <div className="grid grid-cols-3 gap-4 p-6">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Thermometer className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{result.temperature}°C</p>
                <p className="text-sm text-muted-foreground">Temperatura</p>
              </motion.div>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Droplets className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{result.humidity}%</p>
                <p className="text-sm text-muted-foreground">Umidità</p>
              </motion.div>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Wind className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{result.windSpeed} km/h</p>
                <p className="text-sm text-muted-foreground">Vento</p>
              </motion.div>
            </div>

            {/* Data normalized badge */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 text-xs text-success bg-success/10 px-3 py-2 rounded-md w-fit">
                <Cloud className="w-4 h-4" />
                <span>Dati normalizzati e pronti per la UI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show code toggle */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setShowCode(!showCode)}
          className="text-muted-foreground hover:text-primary"
        >
          {showCode ? "Nascondi codice" : "Mostra codice backend"}
        </Button>
      </div>

      {/* Code example */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CodeBlock code={exampleCode} language="typescript" showLineNumbers />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
