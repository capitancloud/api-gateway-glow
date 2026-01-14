/**
 * LiveCodePanel Component
 * =======================
 * 
 * Pannello che mostra il codice JSON in tempo reale durante il flusso API.
 * Sincronizzato con l'animazione del diagramma.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Code, ArrowRight, Check, Database, Globe } from "lucide-react";

type AnimationPhase = 
  | "idle" 
  | "request" 
  | "backend-load-key"
  | "external-call" 
  | "raw-response" 
  | "normalizing"
  | "normalized";

interface CodeStep {
  phase: AnimationPhase;
  title: string;
  icon: React.ReactNode;
  code: string;
  highlight?: string;
}

const codeSteps: CodeStep[] = [
  {
    phase: "idle",
    title: "In attesa...",
    icon: <Code className="w-4 h-4" />,
    code: `// Pronto per una nuova richiesta
// L'utente inserirà una città...`,
  },
  {
    phase: "request",
    title: "1. Richiesta dal Frontend",
    icon: <ArrowRight className="w-4 h-4 text-primary" />,
    code: `// Frontend invia la richiesta al backend
fetch('/api/weather', {
  method: 'POST',
  body: JSON.stringify({
    city: "Roma"
  })
});`,
    highlight: '"Roma"',
  },
  {
    phase: "backend-load-key",
    title: "2. Backend carica API Key",
    icon: <Database className="w-4 h-4 text-warning" />,
    code: `// ⚠️ La API key è SICURA nel backend!
// MAI esposta al client

const API_KEY = Deno.env.get("WEATHER_API_KEY");
// API_KEY = "sk-xxxxx..." (nascosta)

console.log("API Key caricata ✓");`,
    highlight: "WEATHER_API_KEY",
  },
  {
    phase: "external-call",
    title: "3. Chiamata API Esterna",
    icon: <Globe className="w-4 h-4 text-primary" />,
    code: `// Backend chiama OpenWeatherMap
const response = await fetch(
  \`https://api.openweathermap.org/data/2.5/weather
    ?q=Roma
    &appid=\${API_KEY}
    &units=metric\`
);

// Attesa risposta...`,
  },
  {
    phase: "raw-response",
    title: "4. Risposta Grezza (Raw)",
    icon: <Code className="w-4 h-4 text-muted-foreground" />,
    code: `// Risposta originale dall'API
{
  "coord": { "lon": 12.48, "lat": 41.89 },
  "weather": [{
    "main": "Clear",
    "description": "clear sky"
  }],
  "main": {
    "temp": 295.15,  // ← Kelvin!
    "humidity": 45
  },
  "wind": { "speed": 3.5 },
  "name": "Roma",
  "sys": { "country": "IT" }
}`,
    highlight: "295.15",
  },
  {
    phase: "normalizing",
    title: "5. Normalizzazione in corso...",
    icon: <ArrowRight className="w-4 h-4 text-primary animate-pulse" />,
    code: `// Trasformiamo i dati per la nostra UI
const normalized = {
  city: rawData.name,           // "Roma"
  country: rawData.sys.country, // "IT"
  
  // Kelvin → Celsius
  temperature: Math.round(
    rawData.main.temp - 273.15  // 295.15 → 22
  ),
  
  description: rawData.weather[0].description,
  humidity: rawData.main.humidity,
  windSpeed: rawData.wind.speed
};`,
    highlight: "rawData.main.temp - 273.15",
  },
  {
    phase: "normalized",
    title: "6. Dati Pronti! ✓",
    icon: <Check className="w-4 h-4 text-success" />,
    code: `// Dati normalizzati per il frontend
{
  "city": "Roma",
  "country": "IT",
  "temperature": 22,     // ← Celsius!
  "description": "Cielo sereno",
  "humidity": 45,
  "windSpeed": 12
}

// ✅ Pronti per la visualizzazione!`,
    highlight: "22",
  },
];

export const LiveCodePanel = () => {
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>("idle");
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-run animation loop
  useEffect(() => {
    const phases: AnimationPhase[] = [
      "request",
      "backend-load-key", 
      "external-call",
      "raw-response",
      "normalizing",
      "normalized"
    ];
    
    let currentIndex = 0;
    let interval: NodeJS.Timeout;

    const runAnimation = () => {
      setIsAnimating(true);
      
      interval = setInterval(() => {
        setCurrentPhase(phases[currentIndex]);
        currentIndex++;
        
        if (currentIndex >= phases.length) {
          setTimeout(() => {
            currentIndex = 0;
            setCurrentPhase("idle");
            setIsAnimating(false);
          }, 3000);
          clearInterval(interval);
        }
      }, 2000);
    };

    // Start after a delay
    const startTimeout = setTimeout(() => {
      runAnimation();
    }, 1500);

    // Loop
    const loopInterval = setInterval(() => {
      if (!isAnimating) {
        runAnimation();
      }
    }, 18000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
      clearInterval(loopInterval);
    };
  }, []);

  const currentStep = codeSteps.find(s => s.phase === currentPhase) || codeSteps[0];

  return (
    <motion.div 
      className="glass rounded-xl overflow-hidden h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Live Code</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-warning/60" />
          <div className="w-3 h-3 rounded-full bg-success/60" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted relative overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ 
            width: currentPhase === "idle" ? "0%" : 
                   currentPhase === "request" ? "16%" :
                   currentPhase === "backend-load-key" ? "33%" :
                   currentPhase === "external-call" ? "50%" :
                   currentPhase === "raw-response" ? "66%" :
                   currentPhase === "normalizing" ? "83%" : "100%"
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Step indicator */}
      <div className="px-4 py-2 border-b border-border bg-card/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2"
          >
            {currentStep.icon}
            <span className={`text-sm font-medium ${
              currentPhase === "normalized" ? "text-success" : "text-foreground"
            }`}>
              {currentStep.title}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-auto max-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.pre
            key={currentPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs leading-relaxed"
          >
            <code>
              {currentStep.code.split('\n').map((line, i) => {
                const isHighlighted = currentStep.highlight && line.includes(currentStep.highlight);
                const isComment = line.trim().startsWith('//');
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`${
                      isHighlighted 
                        ? "bg-primary/20 -mx-2 px-2 rounded border-l-2 border-primary" 
                        : ""
                    }`}
                  >
                    <span className={
                      isComment 
                        ? "text-muted-foreground" 
                        : isHighlighted 
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

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-border bg-muted/20">
        <p className="text-[10px] text-muted-foreground text-center">
          {currentPhase === "idle" 
            ? "🔄 Animazione in loop automatico" 
            : "📡 Simulazione in tempo reale"}
        </p>
      </div>
    </motion.div>
  );
};
