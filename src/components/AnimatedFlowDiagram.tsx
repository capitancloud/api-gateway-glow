/**
 * AnimatedFlowDiagram Component
 * =============================
 * 
 * Un diagramma animato che mostra il flusso continuo dei dati
 * tra Frontend, Backend e API Esterna con particelle in movimento.
 * Sincronizzato con il LiveCodePanel.
 */

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Monitor, Server, Globe, Lock } from "lucide-react";
import { LiveCodePanel } from "./LiveCodePanel";

type AnimationPhase = "idle" | "request" | "backend" | "external" | "response" | "complete";

export const AnimatedFlowDiagram = () => {
  const [phase, setPhase] = useState<AnimationPhase>("idle");

  // Sync animation phases
  useEffect(() => {
    const phases: AnimationPhase[] = ["request", "backend", "external", "response", "complete"];
    let currentIndex = 0;
    let interval: NodeJS.Timeout;

    const runAnimation = () => {
      interval = setInterval(() => {
        setPhase(phases[currentIndex]);
        currentIndex++;
        
        if (currentIndex >= phases.length) {
          setTimeout(() => {
            currentIndex = 0;
            setPhase("idle");
          }, 3000);
          clearInterval(interval);
        }
      }, 2000);
    };

    const startTimeout = setTimeout(() => {
      runAnimation();
    }, 1500);

    const loopInterval = setInterval(() => {
      runAnimation();
    }, 18000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
      clearInterval(loopInterval);
    };
  }, []);

  const isActive = (p: AnimationPhase | AnimationPhase[]) => {
    if (Array.isArray(p)) return p.includes(phase);
    return phase === p;
  };

  const isPast = (p: AnimationPhase) => {
    const order: AnimationPhase[] = ["idle", "request", "backend", "external", "response", "complete"];
    return order.indexOf(phase) > order.indexOf(p);
  };

  return (
    <div className="grid lg:grid-cols-[1fr,380px] gap-6 p-6">
      {/* Left: Flow Diagram */}
      <div className="relative py-8">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[150px] bg-primary/5 blur-3xl rounded-full" />
        </div>

        {/* Main flow container */}
        <div className="flex items-center justify-between relative z-10 px-4">
          
          {/* Frontend Node */}
          <motion.div className="flex flex-col items-center">
            <motion.div 
              className={`w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                isActive("request") 
                  ? "bg-primary/30 border-2 border-primary glow-primary-strong" 
                  : isPast("request")
                  ? "bg-success/20 border border-success/50"
                  : "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
              }`}
              animate={isActive("request") ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: isActive("request") ? Infinity : 0 }}
            >
              <Monitor className={`w-10 h-10 ${
                isActive("request") ? "text-primary" : 
                isPast("request") ? "text-success" : "text-primary/70"
              }`} />
            </motion.div>
            <span className="mt-3 font-semibold text-foreground text-sm">Frontend</span>
            <span className="text-xs text-muted-foreground">React App</span>
          </motion.div>

          {/* Connection 1 */}
          <div className="flex-1 relative h-16 mx-4">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <line x1="0" y1="50%" x2="100%" y2="50%" 
                stroke={isPast("request") ? "hsl(142 76% 45% / 0.5)" : "hsl(185 100% 50% / 0.3)"} 
                strokeWidth="2" strokeDasharray="6 4"
              />
            </svg>

            {/* Request packet */}
            {isActive("request") && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2"
                initial={{ left: "0%" }}
                animate={{ left: "90%" }}
                transition={{ duration: 1.8, ease: "linear" }}
              >
                <div className="w-4 h-4 rounded-full bg-primary glow-primary-strong" />
                <span className="text-[10px] text-primary font-mono bg-background/80 px-1 rounded">
                  POST
                </span>
              </motion.div>
            )}

            {/* Response packet */}
            {isActive("response") && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2"
                initial={{ right: "0%" }}
                animate={{ right: "90%" }}
                transition={{ duration: 1.8, ease: "linear" }}
              >
                <span className="text-[10px] text-success font-mono bg-background/80 px-1 rounded">
                  200 OK
                </span>
                <div className="w-4 h-4 rounded-full bg-success" style={{ boxShadow: "0 0 15px hsl(142 76% 45% / 0.6)" }} />
              </motion.div>
            )}
          </div>

          {/* Backend Node */}
          <motion.div className="flex flex-col items-center">
            <motion.div 
              className={`w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm relative transition-all duration-300 ${
                isActive(["backend", "external", "response"])
                  ? "bg-primary/30 border-2 border-primary glow-primary-strong" 
                  : isPast("response")
                  ? "bg-success/20 border border-success/50"
                  : "bg-gradient-to-br from-secondary to-secondary/50 border border-primary/20"
              }`}
              animate={isActive("backend") ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, repeat: isActive("backend") ? Infinity : 0 }}
            >
              <Server className={`w-10 h-10 ${
                isActive(["backend", "external", "response"]) ? "text-primary" : 
                isPast("response") ? "text-success" : "text-primary/70"
              }`} />
              
              {/* API Key indicator */}
              <motion.div 
                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                  isActive("backend") ? "bg-warning border-2 border-warning" : "bg-warning/20 border border-warning/50"
                }`}
                animate={isActive("backend") ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: isActive("backend") ? Infinity : 0 }}
              >
                <Lock className="w-3 h-3 text-warning-foreground" />
              </motion.div>
            </motion.div>
            <span className="mt-3 font-semibold text-foreground text-sm">Backend</span>
            <span className="text-xs text-muted-foreground">Edge Function</span>
          </motion.div>

          {/* Connection 2 */}
          <div className="flex-1 relative h-16 mx-4">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <line x1="0" y1="50%" x2="100%" y2="50%" 
                stroke={isPast("external") ? "hsl(142 76% 45% / 0.5)" : "hsl(185 100% 50% / 0.3)"} 
                strokeWidth="2" strokeDasharray="6 4"
              />
            </svg>

            {/* External API request */}
            {isActive("external") && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2"
                initial={{ left: "0%" }}
                animate={{ left: "90%" }}
                transition={{ duration: 1.8, ease: "linear" }}
              >
                <motion.div 
                  className="w-5 h-5 rounded bg-primary flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-2.5 h-2.5 rounded-sm bg-primary-foreground" />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* External API Node */}
          <motion.div className="flex flex-col items-center">
            <motion.div 
              className={`w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                isActive("external")
                  ? "bg-primary/30 border-2 border-primary glow-primary-strong" 
                  : isPast("external")
                  ? "bg-success/20 border border-success/50"
                  : "bg-gradient-to-br from-accent to-accent/50 border border-primary/20"
              }`}
              animate={isActive("external") ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.8, repeat: isActive("external") ? Infinity : 0 }}
            >
              <Globe className={`w-10 h-10 ${
                isActive("external") ? "text-primary" : 
                isPast("external") ? "text-success" : "text-primary/70"
              }`} />
            </motion.div>
            <span className="mt-3 font-semibold text-foreground text-sm">API Esterna</span>
            <span className="text-xs text-muted-foreground">Weather API</span>
          </motion.div>
        </div>

        {/* Status indicator */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className={`text-sm font-medium px-4 py-2 rounded-full ${
            phase === "idle" ? "bg-muted text-muted-foreground" :
            phase === "complete" ? "bg-success/20 text-success" :
            "bg-primary/20 text-primary"
          }`}>
            {phase === "idle" && "🔄 In attesa..."}
            {phase === "request" && "📤 Invio richiesta..."}
            {phase === "backend" && "🔑 Caricamento API Key..."}
            {phase === "external" && "🌐 Chiamata API esterna..."}
            {phase === "response" && "📥 Ricezione risposta..."}
            {phase === "complete" && "✅ Completato!"}
          </span>
        </motion.div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Richiesta</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Risposta</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3 text-warning" />
            <span>API Key sicura</span>
          </div>
        </div>
      </div>

      {/* Right: Live Code Panel */}
      <div className="hidden lg:block">
        <LiveCodePanel />
      </div>
    </div>
  );
};
