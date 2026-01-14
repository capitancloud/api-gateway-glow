/**
 * ApiDemo Component
 * =================
 * 
 * Componente interattivo per dimostrare come funziona una chiamata API.
 * Include animazioni del flusso in tempo reale e pannello JSON live.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, Loader2, Cloud, Thermometer, Wind, Droplets, MapPin, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ApiFlowAnimation, FlowStep } from "@/components/ApiFlowAnimation";
import { DemoLiveCodePanel } from "@/components/DemoLiveCodePanel";

/**
 * Interfaccia per i dati meteo normalizzati
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

const normalizeWeatherData = (rawData: WeatherData): WeatherData => {
  return {
    ...rawData,
    temperature: Math.round(rawData.temperature),
  };
};

export const ApiDemo = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("idle");

  /**
   * Simula una chiamata API con animazioni step-by-step
   */
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setShowCode(false);

    // Step 1: Sending to backend
    setFlowStep("sending-to-backend");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 2: Backend processing (loading API key)
    setFlowStep("backend-processing");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 3: Calling external API
    setFlowStep("calling-api");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 4: Receiving response
    setFlowStep("api-responding");
    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedQuery = query.toLowerCase().replace(/\s+/g, "_");
    const data = mockWeatherData[normalizedQuery];

    if (data) {
      // Step 5: Normalizing data
      setFlowStep("normalizing");
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Step 6: Complete
      setFlowStep("complete");
      const normalizedData = normalizeWeatherData(data);
      setResult(normalizedData);
    } else {
      setFlowStep("error");
      setError(`Città "${query}" non trovata. Prova: Roma, Milano, Napoli, Londra, Parigi, Tokyo, New York`);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setQuery("");
    setResult(null);
    setError(null);
    setFlowStep("idle");
    setShowCode(false);
  };

  const toggleCode = () => {
    setShowCode((prev) => !prev);
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
      {/* Flow Animation Box */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
        <ApiFlowAnimation currentStep={flowStep} query={query} />
      </div>

      {/* Live Code Panel Box */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-4">
        <DemoLiveCodePanel 
          flowStep={flowStep} 
          query={query || "Roma"} 
          rawData={result ? {
            city: result.city,
            country: result.country,
            temperature: result.temperature,
            description: result.description,
            humidity: result.humidity,
            windSpeed: result.windSpeed,
          } : null}
        />
      </div>

      {/* Search input */}
      <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
        <div className="flex gap-4">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Inserisci una città (es: Roma, Milano, Tokyo...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
            disabled={loading}
            className="pl-10 h-12 bg-muted border-border focus:border-primary focus:ring-primary disabled:opacity-50"
          />
        </div>
          <Button 
            type="button"
            onClick={() => {
              console.log("Button clicked, query:", query);
              handleSearch();
            }}
            disabled={loading || !query.trim()}
            className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Results area */}
      <AnimatePresence mode="wait">
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleReset}
                  className="mt-3 text-primary"
                >
                  Riprova
                </Button>
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
            className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden"
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
                <motion.div 
                  className="text-6xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  {result.icon}
                </motion.div>
              </div>
            </div>

            {/* Weather stats */}
            <div className="grid grid-cols-3 gap-6 p-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Thermometer className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{result.temperature}°C</p>
                <p className="text-sm text-muted-foreground">Temperatura</p>
              </motion.div>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Droplets className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{result.humidity}%</p>
                <p className="text-sm text-muted-foreground">Umidità</p>
              </motion.div>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Wind className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{result.windSpeed} km/h</p>
                <p className="text-sm text-muted-foreground">Vento</p>
              </motion.div>
            </div>

            {/* Data normalized badge */}
            <div className="px-8 pb-8 pt-4 flex items-center justify-between border-t border-border/30">
              <motion.div 
                className="flex items-center gap-2 text-xs text-success bg-success/10 px-3 py-2 rounded-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Cloud className="w-4 h-4" />
                <span>Dati normalizzati e pronti per la UI</span>
              </motion.div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="text-muted-foreground hover:text-primary"
              >
                Nuova ricerca
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show code toggle */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={toggleCode}
          className="text-muted-foreground hover:text-primary border-border hover:border-primary gap-2"
        >
          {showCode ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Nascondi codice backend
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Mostra codice backend
            </>
          )}
        </Button>
      </div>

      {/* Code example */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4"
          >
            <CodeBlock code={exampleCode} language="typescript" showLineNumbers />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
