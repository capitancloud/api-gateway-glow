/**
 * CodeBlock Component
 * ===================
 * 
 * Un componente per visualizzare blocchi di codice con syntax highlighting
 * stilizzato e una label opzionale per il linguaggio.
 * 
 * Questo componente è fondamentale per l'aspetto educativo di API Bridge,
 * permettendo di mostrare esempi di codice in modo chiaro e leggibile.
 */

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock = ({ 
  code, 
  language = "javascript", 
  showLineNumbers = false,
  className = "" 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <motion.div 
      className={`code-block relative group ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Language label */}
      {language && (
        <div className="absolute top-3 left-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {language}
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
        aria-label="Copia codice"
      >
        {copied ? (
          <Check className="w-4 h-4 text-success" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Code content */}
      <pre className="pt-10 pb-4 px-4 overflow-x-auto">
        <code className="font-mono text-sm leading-relaxed">
          {showLineNumbers ? (
            lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="w-8 text-muted-foreground/50 select-none text-right mr-4">
                  {index + 1}
                </span>
                <span className="text-foreground">{line}</span>
              </div>
            ))
          ) : (
            <span className="text-foreground whitespace-pre-wrap">{code}</span>
          )}
        </code>
      </pre>
    </motion.div>
  );
};
