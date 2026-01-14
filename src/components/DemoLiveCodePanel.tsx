/**
 * DemoLiveCodePanel Component
 * ===========================
 * 
 * Pannello che mostra il codice JSON in tempo reale nella sezione demo.
 * Sincronizzato con lo step corrente della chiamata API.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Code, ArrowRight, Check, Database, Globe, AlertCircle } from "lucide-react";
import { FlowStep } from "./ApiFlowAnimation";

interface DemoLiveCodePanelProps {
  flowStep: FlowStep;
  query: string;
  rawData?: {
    city: string;
    country: string;
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
  } | null;
}

export const DemoLiveCodePanel = ({ flowStep, query, rawData }: DemoLiveCodePanelProps) => {
  const getCodeContent = () => {
    switch (flowStep) {
      case "idle":
        return {
          title: "In attesa...",
          icon: <Code className="w-4 h-4" />,
          code: `// Inserisci una città e clicca cerca
// per vedere il flusso API in azione!`,
        };
      case "sending-to-backend":
        return {
          title: "1. Invio al Backend",
          icon: <ArrowRight className="w-4 h-4 text-primary" />,
          code: `// Frontend → Backend
fetch('/api/weather', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    city: "${query}"
  })
});`,
        };
      case "backend-processing":
        return {
          title: "2. Caricamento API Key",
          icon: <Database className="w-4 h-4 text-warning" />,
          code: `// Backend (Edge Function)
// ⚠️ La API key è SICURA qui!

const API_KEY = Deno.env.get("WEATHER_API_KEY");
// → "sk-xxxxxxxxxxxxxxxx" (nascosta)

console.log("✓ API Key caricata");
console.log("→ Preparazione chiamata...");`,
        };
      case "calling-api":
        return {
          title: "3. Chiamata API Esterna",
          icon: <Globe className="w-4 h-4 text-primary" />,
          code: `// Chiamata a OpenWeatherMap
const url = \`https://api.openweathermap.org
  /data/2.5/weather
  ?q=${query}
  &appid=\${API_KEY}
  &units=metric\`;

const response = await fetch(url);
// Attesa risposta... ⏳`,
        };
      case "api-responding":
        return {
          title: "4. Risposta Grezza",
          icon: <Code className="w-4 h-4 text-muted-foreground" />,
          code: `// Risposta RAW dall'API
{
  "coord": { "lon": 12.48, "lat": 41.89 },
  "weather": [{
    "description": "clear sky"
  }],
  "main": {
    "temp": 295.15,  // ← Kelvin!
    "humidity": 45
  },
  "wind": { "speed": 12 },
  "name": "${query}",
  "sys": { "country": "IT" }
}`,
        };
      case "normalizing":
        return {
          title: "5. Normalizzazione",
          icon: <ArrowRight className="w-4 h-4 text-primary animate-pulse" />,
          code: `// Trasformazione dati
const normalized = {
  city: rawData.name,
  country: rawData.sys.country,
  
  // Kelvin → Celsius
  temperature: Math.round(
    295.15 - 273.15  // = 22°C ✓
  ),
  
  description: "Cielo sereno",
  humidity: rawData.main.humidity,
  windSpeed: rawData.wind.speed
};`,
        };
      case "complete":
        return {
          title: "6. Dati Pronti! ✓",
          icon: <Check className="w-4 h-4 text-success" />,
          code: rawData ? `// Dati normalizzati per la UI
{
  "city": "${rawData.city}",
  "country": "${rawData.country}",
  "temperature": ${rawData.temperature},
  "description": "${rawData.description}",
  "humidity": ${rawData.humidity},
  "windSpeed": ${rawData.windSpeed}
}

// ✅ Visualizzazione completata!` : `// Dati pronti per la visualizzazione!`,
        };
      case "error":
        return {
          title: "❌ Errore",
          icon: <AlertCircle className="w-4 h-4 text-destructive" />,
          code: `// Errore nella chiamata API
{
  "error": true,
  "message": "Città non trovata",
  "status": 404
}

// Gestisci l'errore gracefully
// mostrando un messaggio all'utente`,
        };
      default:
        return {
          title: "In attesa...",
          icon: <Code className="w-4 h-4" />,
          code: "// Pronto per una nuova richiesta",
        };
    }
  };

  const { title, icon, code } = getCodeContent();

  return (
    <motion.div 
      className="glass rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Live JSON</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted relative overflow-hidden">
        <motion.div 
          className={`h-full ${flowStep === "error" ? "bg-destructive" : "bg-primary"}`}
          initial={{ width: "0%" }}
          animate={{ 
            width: flowStep === "idle" ? "0%" : 
                   flowStep === "sending-to-backend" ? "16%" :
                   flowStep === "backend-processing" ? "33%" :
                   flowStep === "calling-api" ? "50%" :
                   flowStep === "api-responding" ? "66%" :
                   flowStep === "normalizing" ? "83%" : "100%"
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Step indicator */}
      <div className="px-4 py-2 border-b border-border bg-card/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={flowStep}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2"
          >
            {icon}
            <span className={`text-sm font-medium ${
              flowStep === "complete" ? "text-success" : 
              flowStep === "error" ? "text-destructive" :
              "text-foreground"
            }`}>
              {title}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Code content */}
      <div className="p-4 max-h-[300px] overflow-auto">
        <AnimatePresence mode="wait">
          <motion.pre
            key={flowStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs leading-relaxed"
          >
            <code>
              {code.split('\n').map((line, i) => {
                const isComment = line.trim().startsWith('//');
                const hasHighlight = line.includes('→') || line.includes('✓') || line.includes('✅');
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={hasHighlight ? "bg-primary/10 -mx-2 px-2 rounded" : ""}
                  >
                    <span className={
                      isComment 
                        ? "text-muted-foreground" 
                        : hasHighlight 
                        ? "text-primary" 
                        : "text-foreground/90"
                    }>
                      {line}
                    </span>
                  </motion.div>
                );
              })}
            </code>
          </motion.pre>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
