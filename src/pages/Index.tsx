/**
 * API Bridge - Pagina Principale
 * ==============================
 * 
 * Un'applicazione didattica per comprendere le API esterne.
 * 
 * COSA SONO LE API?
 * -----------------
 * API (Application Programming Interface) è un insieme di regole e protocolli
 * che permettono a diverse applicazioni software di comunicare tra loro.
 * Pensa alle API come a un cameriere in un ristorante: tu (il client) fai
 * un ordine, il cameriere (API) lo porta in cucina (server) e ti riporta
 * il piatto pronto (risposta).
 * 
 * PERCHÉ USARE API ESTERNE?
 * -------------------------
 * - Meteo: OpenWeatherMap, WeatherAPI
 * - Mappe: Google Maps, Mapbox
 * - Pagamenti: Stripe, PayPal
 * - AI: OpenAI, Anthropic
 * - Social: Twitter, Facebook
 * 
 * E molto altro! Le API ci permettono di aggiungere funzionalità
 * potenti alle nostre app senza doverle costruire da zero.
 */

import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { ApiDemo } from "@/components/ApiDemo";
import { EducationCard } from "@/components/EducationCard";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Globe, Key, Shield, RefreshCw, Server, Code } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Educational Section */}
      <section className="py-20 container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Concetti Fondamentali
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Prima di iniziare, comprendiamo i concetti chiave per lavorare con le API esterne
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Cosa sono le API */}
          <EducationCard
            icon={Globe}
            title="Cosa sono le API?"
            description="API (Application Programming Interface) sono interfacce che permettono a diverse applicazioni di comunicare. Funzionano come un contratto: tu invii una richiesta in un formato specifico e ricevi una risposta strutturata."
            delay={0.1}
          >
            <CodeBlock
              code={`// Esempio di richiesta API
fetch("https://api.weather.com/v1/current")
  .then(res => res.json())
  .then(data => console.log(data));`}
              language="javascript"
            />
          </EducationCard>

          {/* Card: API Keys */}
          <EducationCard
            icon={Key}
            title="API Keys"
            description="Le API key sono credenziali uniche che identificano la tua applicazione. Servono per autenticare le richieste, tracciare l'utilizzo e proteggere l'accesso alle risorse dell'API."
            delay={0.2}
          >
            <CodeBlock
              code={`// ❌ MAI fare questo!
const API_KEY = "sk-abc123...";

// ✅ Usa variabili d'ambiente
const API_KEY = process.env.API_KEY;`}
              language="javascript"
            />
          </EducationCard>

          {/* Card: Variabili d'Ambiente */}
          <EducationCard
            icon={Shield}
            title="Variabili d'Ambiente"
            description="Le API key NON devono MAI essere nel codice frontend! Vanno nelle variabili d'ambiente del server. Questo protegge le credenziali da accessi non autorizzati."
            delay={0.3}
          >
            <CodeBlock
              code={`# Nel file .env (backend)
WEATHER_API_KEY=abc123xyz

# Nel codice (edge function)
Deno.env.get("WEATHER_API_KEY")`}
              language="bash"
            />
          </EducationCard>

          {/* Card: Normalizzazione */}
          <EducationCard
            icon={RefreshCw}
            title="Normalizzazione Dati"
            description="I dati dalle API spesso arrivano in formati complessi. La normalizzazione li trasforma in strutture più semplici e consistenti per la nostra UI, convertendo unità e traducendo valori."
            delay={0.4}
          >
            <CodeBlock
              code={`// Prima (raw API response)
{ "main": { "temp": 295.15 } }

// Dopo (normalizzato)
{ temperature: 22 } // Kelvin → °C`}
              language="javascript"
            />
          </EducationCard>

          {/* Card: Backend come Proxy */}
          <EducationCard
            icon={Server}
            title="Backend come Proxy"
            description="Il backend (Edge Function) agisce come intermediario sicuro. Riceve la richiesta dal frontend, aggiunge le credenziali, chiama l'API esterna e restituisce i dati normalizzati."
            delay={0.5}
          >
            <CodeBlock
              code={`Frontend → Backend → API Esterna
   ↑                        ↓
   └────── Dati Normalizzati ←`}
              language="text"
            />
          </EducationCard>

          {/* Card: Error Handling */}
          <EducationCard
            icon={Code}
            title="Gestione Errori"
            description="Le API possono fallire (timeout, rate limit, server down). È fondamentale gestire gli errori gracefully mostrando messaggi utili all'utente e loggando per il debug."
            delay={0.6}
          >
            <CodeBlock
              code={`try {
  const data = await fetchAPI();
} catch (error) {
  // Mostra errore all'utente
  showToast("Servizio non disponibile");
}`}
              language="javascript"
            />
          </EducationCard>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Prova la Demo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Inserisci il nome di una città per vedere come funziona una chiamata API 
              che recupera dati meteo e li normalizza per la visualizzazione
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="animated-border p-6 rounded-xl">
              <ApiDemo />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">
            <span className="gradient-text font-semibold">API Bridge</span> — 
            Un esercizio didattico per comprendere le API esterne
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            Creato come progetto educativo • Le API key vanno SEMPRE nelle variabili d'ambiente!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
