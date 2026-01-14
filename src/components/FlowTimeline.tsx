/**
 * FlowTimeline Component
 * =====================
 * 
 * Timeline visiva che mostra tutti gli step del flusso API
 * con indicatore dello step corrente.
 */

import { motion } from "framer-motion";
import { Check, Circle, Loader2, AlertCircle } from "lucide-react";
import { FlowStep } from "./ApiFlowAnimation";
import { FLOW_STEP_ORDER } from "@/lib/constants";

interface FlowTimelineProps {
  currentStep: FlowStep;
}

interface TimelineStep {
  id: FlowStep;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const timelineSteps: TimelineStep[] = [
  {
    id: "sending-to-backend",
    label: "Invio al Backend",
    description: "Il frontend invia la richiesta",
    icon: <Circle className="w-4 h-4" />,
  },
  {
    id: "backend-processing",
    label: "Elaborazione Backend",
    description: "Lettura API key e preparazione",
    icon: <Circle className="w-4 h-4" />,
  },
  {
    id: "calling-api",
    label: "Chiamata API Esterna",
    description: "Richiesta all'API esterna",
    icon: <Circle className="w-4 h-4" />,
  },
  {
    id: "api-responding",
    label: "Risposta API",
    description: "Ricezione dati grezzi",
    icon: <Circle className="w-4 h-4" />,
  },
  {
    id: "normalizing",
    label: "Normalizzazione",
    description: "Trasformazione dati",
    icon: <Circle className="w-4 h-4" />,
  },
  {
    id: "complete",
    label: "Completato",
    description: "Dati pronti per la UI",
    icon: <Check className="w-4 h-4" />,
  },
];

export const FlowTimeline = ({ currentStep }: FlowTimelineProps) => {
  const getStepStatus = (stepId: FlowStep) => {
    if (currentStep === "error") {
      return stepId === "complete" ? "error" : "pending";
    }

    const currentIndex = FLOW_STEP_ORDER.indexOf(currentStep);
    const stepIndex = FLOW_STEP_ORDER.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const getStepIcon = (step: TimelineStep, status: string) => {
    if (status === "completed") {
      return <Check className="w-4 h-4 text-success" />;
    }
    if (status === "active") {
      return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    }
    if (status === "error") {
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      
      <div className="space-y-6 relative">
        {timelineSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isActive = status === "active";
          const isCompleted = status === "completed";
          const isError = status === "error";

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Icon container */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary/20 border-2 border-primary scale-110"
                    : isCompleted
                    ? "bg-success/20 border-2 border-success"
                    : isError
                    ? "bg-destructive/20 border-2 border-destructive"
                    : "bg-muted border-2 border-border"
                }`}
              >
                {getStepIcon(step, status)}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-success"
                      : isError
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
