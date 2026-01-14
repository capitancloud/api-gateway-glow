/**
 * useApiFlow Hook
 * ===============
 * 
 * Custom hook per gestire il flusso API con modalità automatica e manuale
 */

import { useState, useCallback, useMemo } from "react";
import { FlowStep } from "@/components/ApiFlowAnimation";
import {
  FLOW_STEP_ORDER,
  STEP_DURATIONS,
  SPEED_MULTIPLIERS,
  AVAILABLE_CITIES,
} from "@/lib/constants";
import { AnimationSpeed, WeatherData } from "@/lib/types";
import { getWeatherData, normalizeWeatherData } from "@/lib/mockData";

interface UseApiFlowOptions {
  manualMode: boolean;
  animationSpeed: AnimationSpeed;
}

interface UseApiFlowReturn {
  flowStep: FlowStep;
  currentStepIndex: number;
  loading: boolean;
  error: string | null;
  result: WeatherData | null;
  startFlow: (query: string) => Promise<void>;
  nextStep: () => void;
  reset: () => void;
}

export const useApiFlow = ({
  manualMode,
  animationSpeed,
}: UseApiFlowOptions): UseApiFlowReturn => {
  const [flowStep, setFlowStep] = useState<FlowStep>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WeatherData | null>(null);
  const [pendingQuery, setPendingQuery] = useState<string>("");

  const speedMultiplier = useMemo(
    () => SPEED_MULTIPLIERS[animationSpeed],
    [animationSpeed]
  );

  const reset = useCallback(() => {
    setFlowStep("idle");
    setCurrentStepIndex(0);
    setLoading(false);
    setError(null);
    setResult(null);
    setPendingQuery("");
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < FLOW_STEP_ORDER.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const nextStepValue = FLOW_STEP_ORDER[nextIndex];
      setFlowStep(nextStepValue);

      // Verifica dati quando si arriva a normalizing
      if (nextStepValue === "normalizing") {
        const data = getWeatherData(pendingQuery);
        if (!data) {
          setFlowStep("error");
          setError(
            `Città "${pendingQuery}" non trovata. Prova: ${AVAILABLE_CITIES.join(", ")}`
          );
          setLoading(false);
          return;
        }
      }

      // Finalizza quando si arriva a complete
      if (nextStepValue === "complete") {
        const data = getWeatherData(pendingQuery);
        if (data) {
          setResult(normalizeWeatherData(data));
        }
        setLoading(false);
      }
    }
  }, [currentStepIndex, pendingQuery]);

  const startFlow = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setLoading(true);
      setError(null);
      setResult(null);
      setPendingQuery(query);

      if (manualMode) {
        // Modalità manuale: inizia dal primo step
        setCurrentStepIndex(0);
        setFlowStep(FLOW_STEP_ORDER[0]);
      } else {
        // Modalità automatica: procedi automaticamente
        for (const step of FLOW_STEP_ORDER) {
          setFlowStep(step);
          const duration = STEP_DURATIONS[step as keyof typeof STEP_DURATIONS];
          if (duration) {
            await new Promise((resolve) =>
              setTimeout(resolve, duration * speedMultiplier)
            );
          }

          // Verifica dati quando si arriva a normalizing
          if (step === "normalizing") {
            const data = getWeatherData(query);
            if (!data) {
              setFlowStep("error");
              setError(
                `Città "${query}" non trovata. Prova: ${AVAILABLE_CITIES.join(", ")}`
              );
              setLoading(false);
              return;
            }
          }

          // Finalizza quando si arriva a complete
          if (step === "complete") {
            const data = getWeatherData(query);
            if (data) {
              setResult(normalizeWeatherData(data));
            }
            setLoading(false);
            return;
          }
        }
      }
    },
    [manualMode, speedMultiplier]
  );

  return {
    flowStep,
    currentStepIndex,
    loading,
    error,
    result,
    startFlow,
    nextStep,
    reset,
  };
};
