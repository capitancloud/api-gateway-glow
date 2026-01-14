/**
 * Constants
 * =========
 * 
 * Costanti condivise per l'applicazione API Bridge
 */

import { FlowStep } from "@/components/ApiFlowAnimation";

/**
 * Ordine degli step del flusso API
 */
export const FLOW_STEP_ORDER: FlowStep[] = [
  "sending-to-backend",
  "backend-processing",
  "calling-api",
  "api-responding",
  "normalizing",
  "complete",
];

/**
 * Messaggi per ogni step del flusso
 */
export const STEP_MESSAGES: Record<FlowStep, string> = {
  idle: "In attesa di una richiesta...",
  "sending-to-backend": "📤 Invio richiesta al backend...",
  "backend-processing": "⚙️ Backend: lettura API key dalle variabili d'ambiente...",
  "calling-api": "🌐 Chiamata all'API esterna in corso...",
  "api-responding": "📥 Ricezione dati grezzi dall'API...",
  normalizing: "✨ Normalizzazione dei dati in corso...",
  complete: "✅ Dati pronti per la visualizzazione!",
  error: "❌ Errore nella chiamata API",
};

/**
 * Durate degli step in millisecondi (base)
 */
export const STEP_DURATIONS = {
  "sending-to-backend": 800,
  "backend-processing": 1000,
  "calling-api": 1000,
  "api-responding": 800,
  normalizing: 1200,
} as const;

/**
 * Moltiplicatori di velocità
 */
export const SPEED_MULTIPLIERS = {
  slow: 2,
  normal: 1,
  fast: 0.5,
} as const;

/**
 * Città disponibili per la demo
 */
export const AVAILABLE_CITIES = [
  "Roma",
  "Milano",
  "Napoli",
  "Londra",
  "Parigi",
  "Tokyo",
  "New York",
] as const;
