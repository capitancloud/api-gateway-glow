/**
 * ApiFlowAnimation Component
 * ==========================
 * 
 * Visualizza in tempo reale il flusso di una chiamata API con animazioni.
 * Mostra ogni step: Frontend → Backend → API Esterna → Risposta → Normalizzazione
 */

import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, 
  Server, 
  Globe, 
  ArrowRight, 
  Check, 
  Loader2,
  FileJson,
  Sparkles
} from "lucide-react";

export type FlowStep = 
  | "idle" 
  | "sending-to-backend" 
  | "backend-processing" 
  | "calling-api" 
  | "api-responding" 
  | "normalizing" 
  | "complete" 
  | "error";

interface ApiFlowAnimationProps {
  currentStep: FlowStep;
  query?: string;
}

const stepMessages: Record<FlowStep, string> = {
  idle: "In attesa di una richiesta...",
  "sending-to-backend": "📤 Invio richiesta al backend...",
  "backend-processing": "⚙️ Backend: lettura API key dalle variabili d'ambiente...",
  "calling-api": "🌐 Chiamata all'API esterna in corso...",
  "api-responding": "📥 Ricezione dati grezzi dall'API...",
  normalizing: "✨ Normalizzazione dei dati in corso...",
  complete: "✅ Dati pronti per la visualizzazione!",
  error: "❌ Errore nella chiamata API",
};

export const ApiFlowAnimation = ({ currentStep, query }: ApiFlowAnimationProps) => {
  const isActive = (step: FlowStep | FlowStep[]) => {
    if (Array.isArray(step)) return step.includes(currentStep);
    return currentStep === step;
  };

  const isPast = (step: FlowStep) => {
    const order: FlowStep[] = [
      "idle",
      "sending-to-backend",
      "backend-processing",
      "calling-api",
      "api-responding",
      "normalizing",
      "complete",
    ];
    return order.indexOf(currentStep) > order.indexOf(step);
  };

  // Packet animation variants
  const packetVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { opacity: 0, scale: 0 }
  };

  return (
    <div className="glass rounded-xl p-6 mb-6">
      {/* Step indicator message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-center mb-6"
        >
          <span className={`text-sm font-medium ${
            currentStep === "error" ? "text-destructive" : 
            currentStep === "complete" ? "text-success" : 
            "text-primary"
          }`}>
            {stepMessages[currentStep]}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Visual flow diagram */}
      <div className="flex items-center justify-between gap-2 md:gap-4 relative">
        
        {/* Frontend */}
        <motion.div 
          className={`flex flex-col items-center flex-1 ${
            isActive(["sending-to-backend", "complete"]) ? "scale-105" : ""
          }`}
          animate={{ 
            scale: isActive(["sending-to-backend", "complete"]) ? 1.05 : 1 
          }}
        >
          <motion.div 
            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isActive("sending-to-backend") 
                ? "bg-primary/30 glow-primary-strong" 
                : isPast("sending-to-backend") || isActive("complete")
                ? "bg-success/20 border-success"
                : "bg-muted"
            }`}
          >
            <Monitor className={`w-7 h-7 md:w-8 md:h-8 ${
              isActive("sending-to-backend") ? "text-primary" : 
              isPast("sending-to-backend") ? "text-success" : 
              "text-muted-foreground"
            }`} />
          </motion.div>
          <span className="text-xs md:text-sm mt-2 text-foreground font-medium">Frontend</span>
          <span className="text-xs text-muted-foreground hidden md:block">React App</span>
        </motion.div>

        {/* Arrow 1: Frontend → Backend */}
        <div className="flex-1 relative h-8 flex items-center max-w-[80px] md:max-w-[120px]">
          <div className="w-full h-0.5 bg-border" />
          
          {/* Animated packet going right */}
          <AnimatePresence>
            {isActive("sending-to-backend") && (
              <motion.div
                className="absolute left-0"
                initial={{ x: 0, opacity: 0 }}
                animate={{ 
                  x: [0, 80], 
                  opacity: [0, 1, 1, 0] 
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-3 h-3 rounded-full bg-primary glow-primary" />
              </motion.div>
            )}
          </AnimatePresence>

          <ArrowRight className={`absolute right-0 w-4 h-4 ${
            isPast("sending-to-backend") ? "text-success" : "text-muted-foreground"
          }`} />
        </div>

        {/* Backend */}
        <motion.div 
          className="flex flex-col items-center flex-1"
          animate={{ 
            scale: isActive(["backend-processing", "calling-api", "api-responding", "normalizing"]) ? 1.05 : 1 
          }}
        >
          <motion.div 
            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isActive(["backend-processing", "calling-api", "api-responding", "normalizing"])
                ? "bg-primary/30 glow-primary-strong" 
                : isPast("normalizing")
                ? "bg-success/20"
                : "bg-muted"
            }`}
            animate={isActive(["backend-processing", "normalizing"]) ? {
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            {isActive(["backend-processing", "normalizing"]) ? (
              <Loader2 className="w-7 h-7 md:w-8 md:h-8 text-primary animate-spin" />
            ) : (
              <Server className={`w-7 h-7 md:w-8 md:h-8 ${
                isActive(["calling-api", "api-responding"]) ? "text-primary" :
                isPast("normalizing") ? "text-success" : 
                "text-muted-foreground"
              }`} />
            )}
          </motion.div>
          <span className="text-xs md:text-sm mt-2 text-foreground font-medium">Backend</span>
          <span className="text-xs text-muted-foreground hidden md:block">Edge Function</span>
          
          {/* API Key badge */}
          <AnimatePresence>
            {isActive("backend-processing") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-8 text-xs bg-warning/20 text-warning px-2 py-1 rounded mt-1"
              >
                🔑 API_KEY loaded
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Arrow 2: Backend → API */}
        <div className="flex-1 relative h-8 flex items-center max-w-[80px] md:max-w-[120px]">
          <div className="w-full h-0.5 bg-border" />
          
          {/* Animated packet going right */}
          <AnimatePresence>
            {isActive("calling-api") && (
              <motion.div
                className="absolute left-0"
                initial={{ x: 0, opacity: 0 }}
                animate={{ 
                  x: [0, 80], 
                  opacity: [0, 1, 1, 0] 
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-3 h-3 rounded-full bg-primary glow-primary" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated packet coming back (response) */}
          <AnimatePresence>
            {isActive("api-responding") && (
              <motion.div
                className="absolute right-4"
                initial={{ x: 0, opacity: 0 }}
                animate={{ 
                  x: [0, -76], 
                  opacity: [0, 1, 1, 0] 
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-4 h-4 rounded bg-success flex items-center justify-center">
                  <FileJson className="w-2.5 h-2.5 text-success-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ArrowRight className={`absolute right-0 w-4 h-4 ${
            isPast("calling-api") ? "text-success" : "text-muted-foreground"
          }`} />
        </div>

        {/* External API */}
        <motion.div 
          className="flex flex-col items-center flex-1"
          animate={{ 
            scale: isActive(["calling-api", "api-responding"]) ? 1.05 : 1 
          }}
        >
          <motion.div 
            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isActive(["calling-api", "api-responding"])
                ? "bg-primary/30 glow-primary-strong" 
                : isPast("api-responding")
                ? "bg-success/20"
                : "bg-muted"
            }`}
            animate={isActive("api-responding") ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ repeat: Infinity, duration: 0.6 }}
          >
            <Globe className={`w-7 h-7 md:w-8 md:h-8 ${
              isActive(["calling-api", "api-responding"]) ? "text-primary" :
              isPast("api-responding") ? "text-success" : 
              "text-muted-foreground"
            }`} />
          </motion.div>
          <span className="text-xs md:text-sm mt-2 text-foreground font-medium">API Esterna</span>
          <span className="text-xs text-muted-foreground hidden md:block">Weather API</span>
        </motion.div>
      </div>

      {/* Normalization visualization */}
      <AnimatePresence>
        {isActive("normalizing") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="code-block p-3 text-xs">
                <span className="text-muted-foreground">{"{"}</span>
                <br />
                <span className="text-warning ml-2">"main"</span>
                <span className="text-muted-foreground">: {"{"}</span>
                <br />
                <span className="text-warning ml-4">"temp"</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-success">295.15</span>
                <br />
                <span className="text-muted-foreground ml-2">{"}"}</span>
                <br />
                <span className="text-muted-foreground">{"}"}</span>
              </div>

              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>

              <div className="code-block p-3 text-xs border-success/50">
                <span className="text-muted-foreground">{"{"}</span>
                <br />
                <span className="text-primary ml-2">"temperature"</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-success">22</span>
                <span className="text-muted-foreground/50"> // °C</span>
                <br />
                <span className="text-muted-foreground">{"}"}</span>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Kelvin → Celsius, struttura semplificata
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion animation */}
      <AnimatePresence>
        {isActive("complete") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex items-center justify-center gap-2 text-success"
          >
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Flusso completato con successo!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
