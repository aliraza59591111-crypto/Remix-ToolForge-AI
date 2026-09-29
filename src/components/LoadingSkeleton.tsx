import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Layers, Code, ShieldCheck } from 'lucide-react';

interface LoadingSkeletonProps {
  userPrompt: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ userPrompt }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const steps = [
    {
      title: 'Analyzing Tool Architecture',
      desc: 'Formulating state model, calculations, inputs, and output specs',
      icon: Cpu,
    },
    {
      title: 'Designing Responsive Interface',
      desc: 'Crafting clean Tailwind CSS layout with mobile touch optimization',
      icon: Layers,
    },
    {
      title: 'Writing Reactive Logic',
      desc: 'Implementing client-side algorithms, event handlers, and data transformations',
      icon: Code,
    },
    {
      title: 'Securing & Sandboxing',
      desc: 'Enforcing iframe isolation boundary for safe, zero-leak execution',
      icon: ShieldCheck,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-indigo-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Animated background gradient pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-cyan-600/10 to-indigo-600/10 animate-pulse pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-700/60 shadow-lg shadow-indigo-600/20 mb-4 animate-bounce">
            <Sparkles className="w-7 h-7 text-indigo-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
            Forging Your Mini Tool
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto line-clamp-2 italic">
            "{userPrompt}"
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs text-indigo-300 font-mono">
            <span>Elapsed: {elapsedSeconds}s</span>
            <span>•</span>
            <span className="text-emerald-400">Gemini 3.8 Flash Active</span>
          </div>
        </div>

        {/* Stepped Process List */}
        <div className="relative z-10 space-y-3.5 max-w-lg mx-auto mb-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3.5 p-3 rounded-2xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-600/60 shadow-md'
                    : isCompleted
                    ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                    : 'bg-slate-950/20 border-slate-800/40 opacity-40'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : isCompleted
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCurrent ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isCompleted ? (
                    <span className="text-xs font-bold">✓</span>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs sm:text-sm font-semibold ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(95, (currentStep + 1) * 24 + elapsedSeconds * 2)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
