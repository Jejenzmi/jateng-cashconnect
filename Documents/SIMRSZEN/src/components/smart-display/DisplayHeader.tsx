import { useState, useEffect } from "react";
import rsudLogo from "@/assets/logo-simrs-zen.png";

interface DisplayHeaderProps {
  title: string;
  subtitle: string;
  variant?: "primary" | "blue" | "emerald" | "violet" | "amber";
}

const variantClasses = {
  primary: "from-blue-600 to-blue-800",
  blue: "from-blue-400 to-blue-600",
  emerald: "from-emerald-500 to-emerald-700",
  violet: "from-violet-500 to-purple-700",
  amber: "from-amber-500 to-orange-600",
};

export function DisplayHeader({ title, subtitle, variant = "primary" }: DisplayHeaderProps) {
  const bgClass = variantClasses[variant] || variantClasses.primary;

  return (
    <div className={`bg-gradient-to-r ${bgClass} text-white p-4 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={rsudLogo} alt="SIMRS ZEN" className="h-14 w-auto drop-shadow-lg bg-white/90 rounded-lg px-2 py-1" />
          <div>
            <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
            <p className="text-blue-100 text-sm md:text-base">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">SIMRS ZEN</div>
          <div className="text-xs text-blue-200">{new Date().toLocaleDateString("id-ID", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</div>
        </div>
      </div>
    </div>
  );
}
