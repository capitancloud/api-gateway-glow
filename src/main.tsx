import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  // Error boundary fallback
  rootElement.innerHTML = `
    <div style="color: white; padding: 20px; font-family: monospace; background: #1a1a1a;">
      <h1>Error rendering app</h1>
      <pre style="color: #ff6b6b;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}
