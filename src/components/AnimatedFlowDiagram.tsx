/**
 * AnimatedFlowDiagram Component
 * =============================
 * 
 * Un diagramma animato che mostra il flusso continuo dei dati
 * tra Frontend, Backend e API Esterna con particelle in movimento.
 */

import { motion } from "framer-motion";
import { Monitor, Server, Globe, Database, Lock } from "lucide-react";

export const AnimatedFlowDiagram = () => {
  return (
    <div className="relative py-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[200px] bg-primary/5 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Title */}
        <motion.p 
          className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Flusso di una chiamata API
        </motion.p>

        {/* Main flow container */}
        <div className="flex items-center justify-between px-4 md:px-8">
          
          {/* Frontend Node */}
          <motion.div 
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div 
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: "hsl(var(--primary))" }}
              animate={{ 
                boxShadow: [
                  "0 0 20px hsl(185 100% 50% / 0.1)",
                  "0 0 40px hsl(185 100% 50% / 0.2)",
                  "0 0 20px hsl(185 100% 50% / 0.1)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Monitor className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </motion.div>
            <span className="mt-3 font-semibold text-foreground">Frontend</span>
            <span className="text-xs text-muted-foreground">React App</span>
          </motion.div>

          {/* Connection Line 1 with animated particles */}
          <div className="flex-1 relative h-20 mx-2 md:mx-4">
            {/* Static line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(185 100% 50% / 0.5)" />
                  <stop offset="50%" stopColor="hsl(185 100% 50% / 0.2)" />
                  <stop offset="100%" stopColor="hsl(185 100% 50% / 0.5)" />
                </linearGradient>
              </defs>
              <line 
                x1="0" y1="50%" x2="100%" y2="50%" 
                stroke="url(#lineGradient1)" 
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>

            {/* Animated request packet (going right) */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1"
              initial={{ left: "0%" }}
              animate={{ left: ["0%", "100%"] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1
              }}
            >
              <div className="w-3 h-3 rounded-full bg-primary glow-primary" />
              <motion.span 
                className="text-[10px] text-primary font-mono whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                {"{ city: 'Roma' }"}
              </motion.span>
            </motion.div>

            {/* Animated response packet (going left) - delayed */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 translate-y-4 flex items-center gap-1"
              initial={{ right: "0%" }}
              animate={{ right: ["0%", "100%"] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 3,
                repeatDelay: 1
              }}
            >
              <motion.span 
                className="text-[10px] text-success font-mono whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 3, repeatDelay: 1 }}
              >
                {"{ temp: 22°C }"}
              </motion.span>
              <div className="w-3 h-3 rounded-full bg-success" style={{ boxShadow: "0 0 10px hsl(142 76% 45% / 0.5)" }} />
            </motion.div>
          </div>

          {/* Backend Node */}
          <motion.div 
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div 
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 border border-primary/20 flex items-center justify-center backdrop-blur-sm relative"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  "0 0 20px hsl(185 100% 50% / 0.1)",
                  "0 0 30px hsl(185 100% 50% / 0.15)",
                  "0 0 20px hsl(185 100% 50% / 0.1)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <Server className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              
              {/* API Key indicator */}
              <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-warning/20 border border-warning/50 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-3 h-3 text-warning" />
              </motion.div>
            </motion.div>
            <span className="mt-3 font-semibold text-foreground">Backend</span>
            <span className="text-xs text-muted-foreground">Edge Function</span>
            
            {/* Secret badge */}
            <motion.div 
              className="mt-2 flex items-center gap-1 text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Database className="w-3 h-3" />
              <span>API_KEY sicura</span>
            </motion.div>
          </motion.div>

          {/* Connection Line 2 with animated particles */}
          <div className="flex-1 relative h-20 mx-2 md:mx-4">
            {/* Static line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <line 
                x1="0" y1="50%" x2="100%" y2="50%" 
                stroke="url(#lineGradient1)" 
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>

            {/* Animated request to external API */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              initial={{ left: "0%" }}
              animate={{ left: ["0%", "100%"] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 2.5,
                repeatDelay: 1.5
              }}
            >
              <motion.div 
                className="w-4 h-4 rounded bg-primary/80 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-2 h-2 rounded-sm bg-primary" />
              </motion.div>
            </motion.div>

            {/* Animated response from external API */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 translate-y-4"
              initial={{ right: "0%" }}
              animate={{ right: ["0%", "100%"] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 4.5,
                repeatDelay: 1.5
              }}
            >
              <motion.div 
                className="w-4 h-4 rounded bg-success/80 flex items-center justify-center"
              >
                <span className="text-[8px]">📦</span>
              </motion.div>
            </motion.div>
          </div>

          {/* External API Node */}
          <motion.div 
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div 
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-accent to-accent/50 border border-primary/20 flex items-center justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Globe className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </motion.div>
            <span className="mt-3 font-semibold text-foreground">API Esterna</span>
            <span className="text-xs text-muted-foreground">OpenWeatherMap</span>
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div 
          className="flex justify-center gap-6 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
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
            <span>Credenziali sicure</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
