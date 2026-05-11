import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const phrases = [
  "Initializing neural pathways...",
  "Synchronizing global catalog...",
  "Running predictive models...",
  "Analyzing supply chain velocity...",
  "Optimizing capital allocation...",
  "Calculating depletion trajectories...",
  "Aggregating market demand...",
  "Securing data transmission..."
];

const LoadingScreen = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    // Randomize initial phrase to make it feel organic
    setPhraseIndex(Math.floor(Math.random() * phrases.length));
    
    const interval = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % phrases.length);
    }, 1200); // Change phrase every 1.2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-40 animate-fade-in">
      <div className="relative mb-8">
        <Loader2 className="h-12 w-12 text-black animate-spin relative z-10" />
      </div>
      <p className="text-[10px] font-black text-black uppercase tracking-widest animate-pulse">
        {phrases[phraseIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;
