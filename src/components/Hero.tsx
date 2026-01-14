/**
 * Hero Component
 * ==============
 * 
 * Sezione hero con titolo animato e diagramma animato del flusso API.
 */

import { motion } from "framer-motion";
import { Zap, Globe, Lock, ArrowRight } from "lucide-react";
import { AnimatedFlowDiagram } from "./AnimatedFlowDiagram";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Esercizio Didattico</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-foreground">API</span>{" "}
            <span className="gradient-text text-glow">Bridge</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Impara come le applicazioni comunicano con i servizi esterni attraverso le API
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-foreground">API Esterne</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <Lock className="w-5 h-5 text-warning" />
              <span className="text-foreground">API Keys Sicure</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <ArrowRight className="w-5 h-5 text-success" />
              <span className="text-foreground">Normalizzazione Dati</span>
            </div>
          </motion.div>
        </div>

        {/* Animated Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass rounded-2xl max-w-5xl mx-auto"
        >
          <AnimatedFlowDiagram />
        </motion.div>
      </div>
    </section>
  );
};
