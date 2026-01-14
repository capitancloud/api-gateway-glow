/**
 * ApiDemo Component
 * =================
 * 
 * Componente interattivo per dimostrare come funziona una chiamata API.
 * Include animazioni del flusso in tempo reale e pannello JSON live.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import { Search, Loader2, Cloud, Thermometer, Wind, Droplets, MapPin, AlertCircle, Gauge, Play, Pause, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiFlowAnimation } from "@/components/ApiFlowAnimation";
import { DemoLiveCodePanel } from "@/components/DemoLiveCodePanel";
import { FlowTimeline } from "@/components/FlowTimeline";
import { StepExplanationPanel } from "@/components/StepExplanationPanel";
import { DataComparison } from "@/components/DataComparison";
import { useApiFlow } from "@/hooks/useApiFlow";
import { FLOW_STEP_ORDER, STEP_MESSAGES } from "@/lib/constants";
import { AnimationSpeed } from "@/lib/types";

export const ApiDemo = () => {
  const [query, setQuery] = useState("");
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>("normal");
  const [manualMode, setManualMode] = useState(false);

  const {
    flowStep,
    currentStepIndex,
    loading,
    error,
    result,
    startFlow,
    nextStep,
    reset: resetFlow,
  } = useApiFlow({
    manualMode,
    animationSpeed,
  });

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    await startFlow(query);
  }, [query, startFlow]);

  const handleReset = useCallback(() => {
    setQuery("");
    resetFlow();
  }, [resetFlow]);

  const handleModeToggle = useCallback(() => {
    const newManualMode = !manualMode;
    setManualMode(newManualMode);
    if (newManualMode && loading) {
      handleReset();
    }
  }, [manualMode, loading, handleReset]);

  const isLastStep = useMemo(
    () => currentStepIndex >= FLOW_STEP_ORDER.length - 1,
    [currentStepIndex]
  );

  return (
    <div className="space-y-6">
      {/* Timeline and Explanation Panel - Side by side on larger screens */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>📊</span>
            Timeline del Flusso
          </h3>
          <FlowTimeline currentStep={flowStep} />
        </div>

        {/* Explanation Panel */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>📚</span>
            Spiegazione Step
          </h3>
          <StepExplanationPanel currentStep={flowStep} query={query} />
        </div>
      </div>

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

      {/* Data Comparison - Show when data is normalized and available */}
      {result && flowStep === "complete" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6"
        >
          <DataComparison city={query} normalizedData={result} />
        </motion.div>
      )}

      {/* Search input */}
      <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
        <div className="flex flex-col gap-4">
          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Speed selector */}
            {!manualMode && (
              <div className="flex items-center gap-3">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Velocità animazione:</span>
                <Select value={animationSpeed} onValueChange={(v) => setAnimationSpeed(v as "slow" | "normal" | "fast")}>
                  <SelectTrigger className="w-[140px] h-9 bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">🐢 Lenta</SelectItem>
                    <SelectItem value="normal">🚶 Normale</SelectItem>
                    <SelectItem value="fast">🚀 Veloce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Manual mode toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Modalità:</span>
              <Button
                type="button"
                variant={manualMode ? "default" : "outline"}
                size="sm"
                onClick={handleModeToggle}
                disabled={loading && !manualMode}
                className="gap-2"
              >
                {manualMode ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Manuale
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Automatica
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Manual step control */}
          {manualMode && loading && flowStep !== "complete" && flowStep !== "error" && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Step {currentStepIndex + 1} di {FLOW_STEP_ORDER.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({STEP_MESSAGES[flowStep]})
                </span>
              </div>
              <Button
                type="button"
                onClick={nextStep}
                className="gap-2"
                disabled={isLastStep}
              >
                <ArrowRight className="w-4 h-4" />
                Prossimo step
              </Button>
            </motion.div>
          )}
          
          {/* Search row */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Inserisci una città (es: Roma, Milano, Tokyo...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSearch();
                  }
                }}
                disabled={loading}
                className="pl-10 h-12 bg-muted border-border focus:border-primary focus:ring-primary disabled:opacity-50"
              />
            </div>
            <Button 
              type="button"
              onClick={handleSearch}
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
    </div>
  );
};
