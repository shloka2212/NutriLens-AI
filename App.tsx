
import React, { useState, useRef } from 'react';
import { AppState, NutritionData } from './types';
import { analyzeFoodImage } from './services/geminiService';
import { NutritionResult } from './components/NutritionResult';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError("Unable to access camera. Please check your browser permissions.");
      setState(AppState.ERROR);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        setImageUrl(base64);
        stopCamera();
        processImage(base64);
      }
    }
  };

  const processImage = async (base64: string) => {
    try {
      setState(AppState.ANALYZING);
      const data = await analyzeFoodImage(base64);
      setNutritionData(data);
      setState(AppState.RESULT);
    } catch (err: any) {
      setError(err.message || "Failed to analyze ingredients. Please try a clearer photo.");
      setState(AppState.ERROR);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState(AppState.UPLOADING);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageUrl(base64);
      processImage(base64);
    };
    reader.onerror = () => {
      setError("Could not read the image file.");
      setState(AppState.ERROR);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setState(AppState.IDLE);
    setImageUrl(null);
    setNutritionData(null);
    setError(null);
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"></path></svg>
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tighter">NutriLens <span className="text-emerald-600">AI</span></span>
          </div>
          <div className="flex gap-4">
            <button className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors hidden sm:block">Research</button>
            <button className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors hidden sm:block">Privacy</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {state === AppState.IDLE && !isCameraActive && (
          <div className="flex flex-col items-center py-10 md:py-20 animate-in fade-in duration-700">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                Know your plate, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 animate-slow-pan">own your health.</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto">
                NutriLens uses vision-first AI to identify food and calculate instant nutritional breakdowns with expert-level precision.
              </p>
            </div>

            <div className="w-full max-w-xl flex flex-col gap-4">
              <button 
                onClick={startCamera}
                className="group relative flex items-center justify-center gap-3 bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl hover:shadow-emerald-200 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Snap Live Meal
              </button>

              <div className="flex items-center gap-4 px-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or browse</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 rounded-[2rem] bg-white hover:bg-slate-50 hover:border-emerald-400 cursor-pointer transition-all group">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors mb-2">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <span className="text-sm font-bold text-slate-600">Upload Food Photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            <div className="mt-20 flex gap-8 md:gap-16 items-center grayscale opacity-40">
               <div className="flex flex-col items-center">
                 <div className="text-2xl font-black text-slate-900">1.2s</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest">Analysis Speed</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-2xl font-black text-slate-900">98%</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest">Macro Accuracy</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-2xl font-black text-slate-900">5k+</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest">Foods Indexed</div>
               </div>
            </div>
          </div>
        )}

        {isCameraActive && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-in fade-in duration-300 p-4">
             <div className="relative w-full max-w-md h-full max-h-[700px] bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
                <button 
                  onClick={stopCamera}
                  className="absolute top-6 left-6 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
                >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
                <div className="p-10 flex flex-col items-center gap-6 bg-slate-900">
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Center food in frame</p>
                   <button 
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full bg-white border-4 border-emerald-500 p-1 group active:scale-90 transition-transform"
                   >
                     <div className="w-full h-full rounded-full border-2 border-slate-900 bg-white group-hover:bg-slate-50"></div>
                   </button>
                </div>
             </div>
             <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {(state === AppState.UPLOADING || state === AppState.ANALYZING) && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
            <div className="relative mb-8">
               <div className="w-24 h-24 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 animate-pulse">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                 </div>
               </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {state === AppState.UPLOADING ? "Receiving Pixels..." : "Gemini is Identifying Dish..."}
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">
              Extracting macronutrients & allergens
            </p>
            {imageUrl && (
              <div className="mt-10 max-w-xs rounded-3xl overflow-hidden shadow-2xl grayscale opacity-40">
                <img src={imageUrl} alt="Analysis Preview" className="w-full" />
              </div>
            )}
          </div>
        )}

        {state === AppState.RESULT && nutritionData && imageUrl && (
          <NutritionResult 
            data={nutritionData} 
            imageUrl={imageUrl} 
            onReset={reset} 
          />
        )}

        {state === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900">Analysis Halted</h3>
              <p className="text-slate-500 font-medium max-w-sm">{error}</p>
            </div>
            <button 
              onClick={reset}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-white/50 backdrop-blur-sm border-t border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <span>NutriLens Engine v2.5</span>
           <span className="text-emerald-500">Secure Analysis</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
