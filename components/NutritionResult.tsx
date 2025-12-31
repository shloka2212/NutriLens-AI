
import React from 'react';
import { NutritionData } from '../types';
import { NutrientBadge } from './NutrientBadge';

interface NutritionResultProps {
  data: NutritionData;
  imageUrl: string;
  onReset: () => void;
}

export const NutritionResult: React.FC<NutritionResultProps> = ({ data, imageUrl, onReset }) => {
  const getHealthColor = (rating: number) => {
    if (rating >= 8) return 'text-emerald-500';
    if (rating >= 5) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        <div className="w-full md:w-2/5 aspect-square md:aspect-auto h-64 md:h-auto overflow-hidden relative">
          <img src={imageUrl} alt={data.dishName} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm">
             <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Verified AI Analysis</span>
          </div>
        </div>
        
        <div className="flex-1 p-8 md:p-10 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">{data.dishName}</h2>
              <p className="text-slate-500 font-medium">Estimated serving: {data.servingSize}</p>
            </div>
            <div className="text-center bg-slate-50 p-3 rounded-2xl border border-slate-100 min-w-[80px]">
              <div className={`text-2xl font-black ${getHealthColor(data.healthRating)}`}>{data.healthRating}/10</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Health</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
               <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Calories</span>
               <div className="text-2xl font-black text-emerald-900">{data.calories} <span className="text-sm font-medium">kcal</span></div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Protein</span>
               <div className="text-2xl font-black text-blue-900">{data.protein.value} <span className="text-sm font-medium">{data.protein.unit}</span></div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
              "{data.description}"
            </p>
            
            <div className="flex flex-wrap gap-2">
              {data.allergens.map((allergen, i) => (
                <span key={i} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border border-red-100">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <NutrientBadge label="Carbohydrates" data={data.carbohydrates} colorClass="text-amber-600" />
        <NutrientBadge label="Total Fat" data={data.fat} colorClass="text-rose-600" />
        <NutrientBadge label="Dietary Fiber" data={data.fiber} colorClass="text-emerald-600" />
        <NutrientBadge label="Sugar Content" data={data.sugar} colorClass="text-purple-600" />
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onReset}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Analyze Another Plate
        </button>
      </div>
    </div>
  );
};
