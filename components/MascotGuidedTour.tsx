"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  id: string;
  targetSelector: string;
  text: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "settings-tour",
    targetSelector: "#settings-btn, [data-tour='settings']",
    text: "Hi! I'm Bea, your guide! Let's personalize your setup first. Open settings to toggle between English and Filipino, or switch to our high-contrast theme built to combat intense office glare.",
  },
  {
    id: "home-tour",
    targetSelector: "#nav-home, [data-tour='home']",
    text: "This is your primary dashboard. It gives you a clean bird's-eye view of the app and acts as your main jumping-off point for quick actions.",
  },
  {
    id: "phrase-tour",
    targetSelector: "#nav-phrase, [data-tour='phrase']",
    text: "Tap here to pull up the offline phrase dictionary. Communicate in three taps or less by playing 60 pre-saved everyday public-service requests out loud.",
  },
  {
    id: "emergency-tour",
    targetSelector: "#nav-emergency, [data-tour='emergency']",
    text: "This takes you to your critical safety deck. Access your permanent Digital ID Card or use the quick megaphone button to vocalize your emergency status instantly.",
  },
  {
    id: "text-tour",
    targetSelector: "#nav-text, [data-tour='text']",
    text: "Hand the device over to a hearing worker here. When they type their reply, our offline system instantly cleanses complex jargon into short, hyper-clear sentences.",
  },
  {
    id: "fsl-tour",
    targetSelector: "#nav-fsl, [data-tour='fsl']",
    text: "Finally, open this view to use the FSL camera. It uses your device webcam and edge-computed AI to turn your hand gestures into written and spoken words instantly.",
  },
];

// Replaced with actual PNG as requested
const BeaMascot = () => (
  <img 
    src="/icon-192x192.png" 
    alt="Bea" 
    className="w-20 h-20 drop-shadow-lg object-contain" 
  />
);

interface BoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function MascotGuidedTour({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<BoundingRect | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateTargetRect = () => {
    if (currentStep >= TOUR_STEPS.length) return;
    
    const selector = TOUR_STEPS[currentStep].targetSelector;
    const element = document.querySelector(selector);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });
    } else {
      // Fallback to center if element not found
      setTargetRect({
        x: window.innerWidth / 2 - 50,
        y: window.innerHeight / 2 - 50,
        width: 100,
        height: 100,
      });
    }
  };

  useEffect(() => {
    if (!isClient) return;

    updateTargetRect();

    const handleResize = () => updateTargetRect();
    const handleScroll = () => updateTargetRect();
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    
    // Poll for dynamic elements appearing (useful for SPAs)
    const interval = setInterval(updateTargetRect, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [currentStep, isClient]);

  if (!isClient) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete?.();
  };

  const stepData = TOUR_STEPS[currentStep];
  
  // Calculate circle center and radius for the spotlight
  const cx = targetRect ? targetRect.x + targetRect.width / 2 : (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const cy = targetRect ? targetRect.y + targetRect.height / 2 : (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const r = targetRect ? Math.max(targetRect.width, targetRect.height) / 2 + 16 : 0;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center">
      {/* Dimmed Overlay with Circular Cutout (Mask) */}
      <AnimatePresence>
        <motion.div
          key="overlay"
          className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-none"
          initial={{ opacity: 0 }}
          animate={({
            opacity: 1,
            WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, black ${r + 2}px)`,
            maskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, black ${r + 2}px)`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {/* Target Element Outline (Circular Highlight) */}
      {targetRect && (
        <motion.div
          className="absolute top-0 left-0 border-4 border-yellow-400 rounded-full pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: cx - r,
            y: cy - r,
            width: r * 2,
            height: r * 2,
          }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
        />
      )}

      {/* Mascot & Chat Bubble container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="relative max-w-sm w-full px-4 z-10 -mt-28"
        >
          {/* Neo-Brutalist Chat Bubble */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-5 text-black">
            {/* Mascot */}
            <div className="flex justify-center mb-3">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
                <BeaMascot />
              </motion.div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
              <h3 className="font-bold text-lg leading-none">Step {currentStep + 1} of 6</h3>
              <span className="text-xs font-bold uppercase tracking-wider bg-black text-white px-2 py-1 rounded-full">
                Tour
              </span>
            </div>
            
            {/* Instruction Text */}
            <p className="text-base font-medium mb-6 leading-relaxed">
              {stepData.text}
            </p>

            {/* Navigation Row */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex-1 min-w-[80px] px-4 py-2 border-2 border-black font-bold uppercase text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                Back
              </button>
              
              <button
                onClick={handleNext}
                className="flex-[2] min-w-[120px] px-4 py-2 bg-yellow-400 border-2 border-black font-bold uppercase text-sm rounded-lg hover:bg-yellow-300 transition-colors active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next Step"}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <button 
                onClick={handleSkip}
                className="text-sm font-bold underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
              >
                Skip Tour
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
}
