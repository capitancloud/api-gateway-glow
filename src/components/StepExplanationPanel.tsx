/**
 * StepExplanationPanel Component
 * ==============================
 * 
 * Pannello che mostra spiegazioni dettagliate e contestuali
 * per ogni step del flusso API.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Info, Code, Shield, RefreshCw, Server, Globe, FileJson, CheckCircle, AlertCircle } from "lucide-react";
import { FlowStep } from "./ApiFlowAnimation";

interface StepExplanationPanelProps {
  currentStep: FlowStep;
  query?: string;
}

interface StepExplanation {
  title: string;
  description: string;
  details: string[];
  codeExample?: string | ((query?: string) => string);
  iconType: "info" | "server" | "shield" | "globe" | "filejson" | "refresh" | "check" | "alert";
  tips?: string[];
}

const stepExplanations: Record<FlowStep, StepExplanation> = {
  idle: {
    title: "In attesa",
    description: "Il sistema è pronto per ricevere una richiesta",
    details: [
      "Il frontend è in attesa che l'utente inserisca una città",
      "Nessuna chiamata API è stata ancora effettuata",
      "Tutti i componenti sono inizializzati e pronti",
    ],
    iconType: "info",
    tips: [
      "Inserisci il nome di una città per iniziare",
      "Prova con: Roma, Milano, Napoli, Londra, Parigi, Tokyo, New York",
    ],
  },
  "sending-to-backend": {
    title: "Invio Richiesta al Backend",
    description: "Il frontend invia la richiesta dell'utente al server backend",
    details: [
      "Il frontend prepara i dati della richiesta (nome città)",
      "La richiesta viene inviata tramite HTTP POST al backend",
      "Il backend riceve la richiesta e inizia l'elaborazione",
    ],
    iconType: "server",
    codeExample: (query?: string) => `// Frontend invia la richiesta
fetch('/api/weather', {
  method: 'POST',
  body: JSON.stringify({ city: '${query || "Roma"}' })
})`,
    tips: [
      "Il frontend NON contiene mai le API key",
      "Tutte le credenziali sono gestite dal backend",
    ],
  },
  "backend-processing": {
    title: "Elaborazione Backend",
    description: "Il backend prepara la chiamata all'API esterna",
    details: [
      "Il backend legge l'API key dalle variabili d'ambiente",
      "Valida i dati ricevuti dal frontend",
      "Prepara la richiesta per l'API esterna",
    ],
    iconType: "shield",
    codeExample: `// Backend legge l'API key (SICURA!)
const API_KEY = Deno.env.get("WEATHER_API_KEY");

// Valida i dati
const { city } = await req.json();
if (!city) throw new Error("City required");`,
    tips: [
      "Le API key sono nelle variabili d'ambiente, mai nel codice",
      "Il backend agisce come proxy sicuro tra frontend e API esterna",
    ],
  },
  "calling-api": {
    title: "Chiamata API Esterna",
    description: "Il backend chiama l'API esterna con le credenziali",
    details: [
      "Il backend costruisce l'URL della richiesta con l'API key",
      "Invia la richiesta HTTP all'API esterna (es. OpenWeatherMap)",
      "L'API esterna elabora la richiesta e prepara la risposta",
    ],
    iconType: "globe",
    codeExample: `// Backend chiama l'API esterna
const response = await fetch(
  \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}\`
);`,
    tips: [
      "L'API key è inclusa nella richiesta ma non è visibile al frontend",
      "Il backend gestisce rate limiting e retry logic",
    ],
  },
  "api-responding": {
    title: "Ricezione Dati Grezzi",
    description: "L'API esterna restituisce i dati nella sua struttura originale",
    details: [
      "L'API esterna restituisce dati in formato JSON",
      "I dati contengono informazioni complete ma in formato complesso",
      "Il backend riceve la risposta e la prepara per la normalizzazione",
    ],
    iconType: "filejson",
    codeExample: `// Dati grezzi dall'API
{
  "main": { "temp": 295.15 },  // Kelvin
  "weather": [{ "description": "clear sky" }],
  "wind": { "speed": 3.5 },     // m/s
  "name": "Rome"
}`,
    tips: [
      "I dati grezzi spesso hanno unità di misura diverse (Kelvin vs Celsius)",
      "La struttura può essere complessa e non ottimale per la UI",
    ],
  },
  normalizing: {
    title: "Normalizzazione Dati",
    description: "Il backend trasforma i dati grezzi in un formato semplice e consistente",
    details: [
      "Conversione delle unità di misura (Kelvin → Celsius)",
      "Semplificazione della struttura dati",
      "Traduzione e formattazione dei valori",
    ],
    iconType: "refresh",
    codeExample: `// Dati normalizzati per la UI
{
  "city": "Rome",
  "temperature": 22,        // °C
  "description": "Cielo sereno",
  "humidity": 45,           // %
  "windSpeed": 12           // km/h
}`,
    tips: [
      "La normalizzazione rende i dati più facili da usare nel frontend",
      "Tutte le conversioni avvengono nel backend, non nel frontend",
    ],
  },
  complete: {
    title: "Completato",
    description: "I dati normalizzati sono pronti per essere visualizzati nella UI",
    details: [
      "Il backend restituisce i dati normalizzati al frontend",
      "Il frontend riceve dati in formato semplice e consistente",
      "La UI può visualizzare i dati senza ulteriori trasformazioni",
    ],
    iconType: "check",
    codeExample: `// Frontend riceve dati pronti
const data = await response.json();
// data.temperature è già in °C
// data.windSpeed è già in km/h
// Pronto per la visualizzazione!`,
    tips: [
      "Il frontend riceve sempre dati normalizzati e pronti all'uso",
      "Nessuna logica di conversione è necessaria nel frontend",
    ],
  },
  error: {
    title: "Errore",
    description: "Si è verificato un errore durante la chiamata API",
    details: [
      "L'errore può essere causato da: città non trovata, API key invalida, o problemi di rete",
      "Il backend gestisce l'errore e restituisce un messaggio chiaro",
      "Il frontend mostra un messaggio di errore all'utente",
    ],
    iconType: "alert",
    tips: [
      "Verifica che il nome della città sia corretto",
      "Controlla la connessione internet",
    ],
  },
};

export const StepExplanationPanel = ({ currentStep, query }: StepExplanationPanelProps) => {
  const explanation = stepExplanations[currentStep] || stepExplanations.idle;

  if (!explanation) {
    return null;
  }

  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (explanation.iconType) {
      case "info":
        return <Info className={iconClass} />;
      case "server":
        return <Server className={iconClass} />;
      case "shield":
        return <Shield className={iconClass} />;
      case "globe":
        return <Globe className={iconClass} />;
      case "filejson":
        return <FileJson className={iconClass} />;
      case "refresh":
        return <RefreshCw className={iconClass} />;
      case "check":
        return <CheckCircle className={iconClass} />;
      case "alert":
        return <AlertCircle className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
              currentStep === "error"
                ? "bg-destructive/10 text-destructive"
                : currentStep === "complete"
                ? "bg-success/10 text-success"
                : "bg-primary/10 text-primary"
            }`}
          >
            {getIcon()}
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-foreground">{explanation.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{explanation.description}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Cosa succede:
          </h5>
          <ul className="space-y-2">
            {explanation.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Code Example */}
        {explanation.codeExample && (
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Esempio Codice:
            </h5>
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <pre className="text-xs font-mono text-foreground overflow-x-auto">
                <code>
                  {typeof explanation.codeExample === 'function' 
                    ? explanation.codeExample(query)
                    : explanation.codeExample}
                </code>
              </pre>
            </div>
          </div>
        )}

        {/* Tips */}
        {explanation.tips && explanation.tips.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              💡 Suggerimenti:
            </h5>
            <ul className="space-y-1.5">
              {explanation.tips.map((tip, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-warning mt-0.5">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
