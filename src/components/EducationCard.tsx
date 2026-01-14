/**
 * EducationCard Component
 * =======================
 * 
 * Card educativa con animazioni per spiegare concetti chiave sulle API.
 * Ogni card ha un'icona, un titolo e una descrizione dettagliata.
 * 
 * Il design usa glassmorphism per creare profondità visiva
 * mantenendo la leggibilità del contenuto.
 */

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EducationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  delay?: number;
}

export const EducationCard = ({ 
  icon: Icon, 
  title, 
  description, 
  children,
  delay = 0 
}: EducationCardProps) => {
  return (
    <motion.div
      className="glass rounded-xl p-6 hover:glow-primary transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Icon container with glow effect */}
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 glow-primary">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>

      {/* Optional children (code examples, etc.) */}
      {children}
    </motion.div>
  );
};
