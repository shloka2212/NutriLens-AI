
import React from 'react';
import { Nutrient } from '../types';

interface NutrientBadgeProps {
  label: string;
  data: Nutrient;
  colorClass: string;
}

export const NutrientBadge: React.FC<NutrientBadgeProps> = ({ label, data, colorClass }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transition-all hover:scale-105">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <span className={`text-xl font-bold ${colorClass}`}>{data.value}</span>
        <span className="text-[10px] font-medium text-slate-400">{data.unit}</span>
      </div>
    </div>
  );
};
